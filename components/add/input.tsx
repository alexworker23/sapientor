"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { useDebounce } from "@/lib/hooks"
import { useInputStore } from "@/lib/store"
import { cn, urlRegex } from "@/lib/utils"
import { addOwnSummary } from "@/app/actions/add-own-summary"

import { useToast } from "../ui/use-toast"
import { FilesDisplay } from "./files-display"
import { MetadataDisplay } from "./metadata-display"
import { PasteButton } from "./paste-button"
import { SuccessMessage } from "./success-message"
import { TextareaInput } from "./textarea-input"
import { UploadButton } from "./upload-button"
import { SubmitButton } from "./submit-button"

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
  } = useInputStore()
  const { toast } = useToast()
  const router = useRouter()

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
            {hasFiles && <FilesDisplay />}
            {success && <SuccessMessage />}
          </div>
          <div className="flex w-full transition-all duration-300 z-10">
            <TextareaInput handleSubmit={handleSubmit} />
            <div className="flex py-2.5 pr-2.5">
              <PasteButton />
              <UploadButton />
              <SubmitButton handleSubmit={handleSubmit} />
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
            <MetadataDisplay />
          </div>
        </div>
      </div>
    </div>
  )
}

const generateUniqueFilePath = (file: File, user_id: string) => {
  const fileExt = file.name.split(".").pop()
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15) // Random string for uniqueness
  return `${user_id}/${timestamp}-${randomString}.${fileExt}`
}
