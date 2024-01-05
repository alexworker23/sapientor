"use client"

import {
  useEffect,
  useRef,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react"
import {
  ClipboardCheckIcon,
  CornerDownLeft,
  FileBarChart,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  UploadIcon,
  X,
} from "lucide-react"

import { useInputStore } from "@/lib/store"
import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { useToast } from "../ui/use-toast"

export const SourceInput = () => {
  const { value, setValue, files, setFiles } = useInputStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { toast } = useToast()

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

  return (
    <div className="relative w-full max-w-[90%] sm:max-w-lg m-auto mt-24">
      <div className="w-full absolute bottom-0 left-0">
        <div className="overflow-hidden flex flex-col w-full shadow-md focus-within:shadow-lg divide-slate-600 min-h-12 bg-slate-50 focus-within:shadow-black/40 rounded-2xl transition-all">
          <div
            style={{
              height: hasFiles ? "60px" : "0px",
              transformOrigin: "50% 50% 0px",
            }}
            className={cn(
              "z-0 transition-all duration-300 ease-in-out",
              hasFiles ? "border-b" : ""
            )}
          >
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
          </div>
          <div className="flex w-full transition-all duration-300 z-10">
            <textarea
              id="textarea-input"
              ref={textareaRef}
              placeholder="Type in link or text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full disabled:opacity-80 text-primary text-sm bg-slate-50 border-0 shadow-none resize-none outline-none ring-0 disabled:bg-transparent selection:bg-blue-200 selection:text-black placeholder:text-slate-500 [scroll-padding-block:0.75rem] pr-2 leading-relaxed py-3 pl-2.5 [&_textarea]:px-0"
              style={{
                colorScheme: "dark",
              }}
              rows={1}
              onInput={handleTextAreaResize}
            />
            <div className="flex p-2.5">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={handlePaste}
                      className="cursor-pointer rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7"
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7"
                    >
                      <UploadIcon size={16} />
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        multiple
                        accept=".pdf,.csv,.docx,.txt,.md,.json"
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
                      className={cn(
                        "rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7",
                        Boolean(value.trim())
                          ? "cursor-pointer"
                          : "hover:bg-transparent text-primary/40"
                      )}
                    >
                      <CornerDownLeft size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-slate-50">
                    Submit
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
