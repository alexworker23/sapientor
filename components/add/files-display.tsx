"use client"

import {
  FileBarChart,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  X,
} from "lucide-react"

import { useInputStore } from "@/lib/store"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export const FilesDisplay = () => {
  const { files, setFiles } = useInputStore()

  const handleFileRemove = (file: File) => {
    const newFiles = files?.filter(
      (f) => f.name !== file.name && file.size !== f.size
    )
    setFiles(newFiles ?? null)
  }

  return (
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
