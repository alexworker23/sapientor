"use client"

import {
  useEffect,
  useRef,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  CheckCircle,
  ClipboardCheckIcon,
  CornerDownLeft,
  FileBarChart,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  Loader2,
  UploadIcon,
  X,
} from "lucide-react"

import type { Database } from "@/lib/database.types"
import { useDebounce } from "@/lib/hooks"
import { useInputStore } from "@/lib/store"
import { cn, decodeHtmlEntities, urlRegex } from "@/lib/utils"
import { addOwnSummary } from "@/app/actions/add-own-summary"

import { Avatar, AvatarImage } from "../ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { useToast } from "../ui/use-toast"

export const SourceInput = () => {
  const {
    value,
    setValue,
    files,
    setFiles,
    setMetadata,
    metadata,
    setSubmitting,
    submitting,
    success,
    setSuccess,
    setSuccessMessage,
    successMessage,
  } = useInputStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { toast } = useToast()
  const router = useRouter()

  const handleTextAreaResize: FormEventHandler<HTMLTextAreaElement> = (e) => {
    const target = e.target as HTMLTextAreaElement
    const parentDiv = target.closest(".flex") as HTMLDivElement

    if (target.value) {
      // Only resize if there is text
      target.style.height = "auto"
      const newHeight = target.scrollHeight + "px"
      target.style.height = newHeight
      if (parentDiv) {
        parentDiv.style.height = newHeight
      }
    } else {
      // Reset the heights if the textarea is empty
      target.style.height = "auto"
      if (parentDiv) {
        parentDiv.style.height = "initial" // or set to a specific value if you have one
      }
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files
    const arr = files ? Array.from(files) : null
    const maxFiles = 3
    const maxSize = 25 * 1024 * 1024

    if (arr && arr.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload max ${maxFiles} files`,
        variant: "destructive",
      })
      return
    }

    if (arr && arr.some((file) => file.size > maxSize)) {
      toast({
        title: "File too big",
        description: `Max file size is 25 MB`,
        variant: "destructive",
      })
      return
    }
    setFiles(arr)
  }

  const handlePaste = async () => {
    await navigator.clipboard.readText().then((text) => {
      if (!text.trim()) return
      setValue(text)

      const textarea = document.getElementById("textarea-input")
      if (textarea) {
        // Trigger the input event manually
        const event = new Event("input", { bubbles: true })
        textarea.dispatchEvent(event)
      }
    })
  }

  useEffect(() => {
    if (value && textareaRef.current) {
      const event = new Event("input", { bubbles: true })
      textareaRef.current.dispatchEvent(event)
    }
  }, [value])

  const handleFileRemove = (file: File) => {
    const newFiles = files?.filter(
      (f) => f.name !== file.name && file.size !== f.size
    )
    setFiles(newFiles ?? null)
  }

  const hasFiles = files && files.length > 0

  const getMetadata = async (url: string) => {
    try {
      const response = await fetch(`/api/metadata`, {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
      setMetadata(response)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  const fetchLinkData = async (url: string) => {
    const isValid = urlRegex.test(url)
    if (!isValid) return

    const isSame = url === metadata?.url
    if (isSame) return

    try {
      await getMetadata(url)
    } catch (error) {
      console.error(error)
    }
  }

  const debouncedValue = useDebounce(value, 250)
  useEffect(() => {
    if (urlRegex.test(debouncedValue)) {
      fetchLinkData(debouncedValue)
    }
  }, [debouncedValue])

  const supabase = createClientComponentClient<Database>()

  const handleStoreFiles = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User is not authenticated")

    if (!files || !files.length) return null

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = generateUniqueFilePath(file, user.id)
        const { error: uploadError } = await supabase.storage
          .from("files")
          .upload(filePath, file)

        if (uploadError) throw new Error(uploadError.message)

        return {
          url: filePath,
          title: file.name,
        }
      })
    )

    const sources_to_insert: Database["public"]["Tables"]["sources"]["Insert"][] =
      uploadedFiles.map((file) => ({
        ...file,
        type: "FILE",
        status: "PENDING",
      }))

    const { data: createdEntities, error: creationError } = await supabase
      .from("sources")
      .insert(sources_to_insert)
      .select("*")

    if (createdEntities?.length) {
      for (const source of createdEntities) {
        fetch("/api/parse/file", {
          method: "POST",
          body: JSON.stringify({ source_id: source.id }),
        })
      }
    }

    if (creationError) throw new Error(creationError.message)
    if (!createdEntities) throw new Error("Error while saving file")
  }

  const handleStoreLink = async () => {
    const { data: createdEntity, error: creationError } = await supabase
      .from("sources")
      .insert({
        url: value,
        title: metadata?.title || value,
        description: metadata?.description,
        icon: metadata?.icon,
        status: "PENDING",
        type: "LINK",
      })
      .select("*")
      .single()

    if (creationError) throw new Error(creationError.message)
    if (!createdEntity) throw new Error("Error while saving link")

    fetch("/api/parse/link", {
      method: "POST",
      body: JSON.stringify({ source_id: createdEntity.id }),
    })
  }

  const handleStoreText = async () => {
    const { data: createdEntity, error: creationError } = await supabase
      .from("sources")
      .insert({
        title: value.slice(0, 50),
        description: value,
        type: "NOTE",
      })
      .select("*")
      .single()

    if (creationError) throw new Error(creationError.message)
    if (!createdEntity) throw new Error("Error while saving text note")

    const formData = new FormData()
    formData.append("title", createdEntity.title ?? "")
    formData.append("description", createdEntity.description ?? "")
    formData.append("content", value)
    formData.append("sourceId", createdEntity.id)
    formData.append("userId", createdEntity.user_id)

    const { code, message } = await addOwnSummary(formData)
    if (code !== 200) throw new Error(message)
  }

  const handleSubmit = async () => {
    try {
      if (!value.trim() && !files?.length) return
      if (submitting) return

      setSubmitting(true)

      if (files && files.length) {
        await handleStoreFiles()
      }

      const isValidUrl = urlRegex.test(value)

      if (value && isValidUrl) {
        await handleStoreLink()
      }

      if (value && !isValidUrl) {
        await handleStoreText()
      }

      setFiles(null)
      setMetadata(null)
      setValue("")

      router.refresh()

      const textarea = document.getElementById("textarea-input")
      if (textarea) {
        const parentDiv = textarea.closest(".flex") as HTMLDivElement
        textarea.style.height = "auto"
        if (parentDiv) {
          parentDiv.style.height = "initial"
        }
      }

      setSuccess(true)

      const successMessage = `Saved ${
        files?.length ? `${files.length} files${!!value ? " and " : ""}` : ""
      } ${
        isValidUrl ? "1 link" : value ? "1 text note" : ""
      } to your knowledge base.`
      setSuccessMessage(successMessage)

      setTimeout(() => {
        setSuccess(false)
      }, 3000)

      setTimeout(() => {
        setSuccessMessage(null)
      }, 3500)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative w-full max-w-[90%] sm:max-w-lg mx-auto sm:mt-24 min-h-screen">
      <div className="w-full absolute top-0 left-0">
        <div className="overflow-hidden flex flex-col w-full shadow-md focus-within:shadow-lg min-h-12 bg-slate-50 focus-within:shadow-black/40 rounded-2xl transition-all">
          <div
            style={{
              height: hasFiles || success ? "60px" : "0px",
              transformOrigin: "50% 50% 0px",
            }}
            className={cn(
              "z-0 transition-all duration-300 ease-in-out",
              hasFiles || success ? "border-b border-slate-200" : ""
            )}
          >
            {hasFiles && (
              <div className="flex gap-2 p-2.5">
                {files?.map((file) => (
                  <div
                    key={`file-${file.name}-${file.size}`}
                    className="flex relative items-center gap-2 w-full hover:bg-slate-100 justify-center rounded-md transition-colors group py-0.5 px-1 max-w-[130px]"
                  >
                    {getFileLogo(file.name)}
                    <div className="flex flex-col">
                      <p className="text-sm font-medium truncate max-w-[60px] md:max-w-[90px]">
                        {file.name}
                      </p>
                      <span className="text-xs text-slate-500">
                        {getFileSize(file.size)}
                      </span>
                    </div>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => handleFileRemove(file)}
                            className="absolute -top-2.5 -right-2.5 w-5 h-5 justify-center items-center flex sm:group-hover:flex sm:hidden rounded-full bg-white cursor-pointer"
                          >
                            <X size={12} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-50">
                          Remove file
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 p-2.5">
                <CheckCircle className="text-green-600" size={24} />
                <div>
                  <h4 className="text-sm font-medium">Success 🎉</h4>
                  <p className="text-xs">{successMessage}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex w-full transition-all duration-300 z-10">
            <textarea
              id="textarea-input"
              ref={textareaRef}
              placeholder="Insert a link, type text or upload a file"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                metadata && setMetadata(null)
              }}
              onKeyDown={(e) => {
                // only if just enter click and not shift+enter
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              className="w-full disabled:opacity-80 text-primary text-sm bg-slate-50 border-0 shadow-none resize-none outline-none ring-0 disabled:bg-transparent selection:bg-blue-200 selection:text-black placeholder:text-slate-500 placeholder:truncate pr-2 [scroll-padding-block:0.75rem] leading-relaxed py-3 pl-2.5 [&_textarea]:px-0"
              style={{ colorScheme: "dark" }}
              rows={1}
              onInput={handleTextAreaResize}
            />
            <div className="flex py-2.5 pr-2.5">
              <TooltipProvider delayDuration={50}>
                <Tooltip open={submitting ? false : undefined}>
                  <TooltipTrigger asChild>
                    <div
                      onClick={handlePaste}
                      className={cn(
                        "cursor-pointer rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7",
                        submitting ? "cursor-not-allowed opacity-50" : ""
                      )}
                    >
                      <ClipboardCheckIcon size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-slate-50">
                    Paste
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip open={submitting ? false : undefined}>
                  <TooltipTrigger asChild>
                    <label
                      htmlFor="file-upload"
                      className={cn(
                        "cursor-pointer rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7",
                        submitting ? "cursor-not-allowed opacity-50" : ""
                      )}
                    >
                      <UploadIcon size={16} />
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        multiple
                        accept=".pdf,.csv,.docx,.txt,.md,.json"
                        disabled={submitting}
                      />
                    </label>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-slate-50">
                    Upload
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={handleSubmit}
                      className={cn(
                        "rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7",
                        Boolean(value.trim())
                          ? "cursor-pointer"
                          : "hover:bg-transparent text-primary/40"
                      )}
                    >
                      {submitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CornerDownLeft size={16} />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-slate-50">
                    {submitting ? "Submitting..." : "Submit"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div
            style={{
              height: !!metadata ? "80px" : "0px",
              transformOrigin: "50% 50% 0px",
            }}
            className={cn(
              "z-0 transition-all duration-300 ease-in-out",
              !!metadata ? "border-t border-slate-200" : ""
            )}
          >
            {!!metadata && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex p-4 items-start space-x-4 max-w-full overflow-hidden">
                      <div className="flex items-center space-x-2 flex-shrink-0 mt-1">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={metadata.icon || "/icon.png"} />
                        </Avatar>
                      </div>
                      <div className="space-y-1 flex-grow min-w-0">
                        <h3 className="truncate text-xl">
                          {decodeHtmlEntities(metadata.title)}
                        </h3>
                        <p className="truncate text-sm">
                          {decodeHtmlEntities(metadata.description)}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-md">
                    <div>
                      <h3 className="font-semibold text-base mb-1">
                        {decodeHtmlEntities(metadata.title)}
                      </h3>
                      <p className="text-sm">
                        {decodeHtmlEntities(metadata.description)}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const getFileLogo = (name: string) => {
  const ext = name.split(".").pop()
  switch (ext) {
    case "pdf":
      return <FileImage size={24} />
    case "docx":
      return <FileText size={24} />
    case "xlsx":
      return <FileSpreadsheet size={24} />
    case "csv":
      return <FileBarChart size={24} />
    case "txt":
      return <FileType size={24} />
    default:
      return <FileIcon size={24} />
  }
}

const getFileSize = (size: number) => {
  const kb = size / 1000
  const mb = kb / 1000
  if (mb > 1) return `${mb.toFixed(2)} MB`
  return `${kb.toFixed(2)} KB`
}

const generateUniqueFilePath = (file: File, user_id: string) => {
  const fileExt = file.name.split(".").pop()
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15) // Random string for uniqueness
  return `${user_id}/${timestamp}-${randomString}.${fileExt}`
}
