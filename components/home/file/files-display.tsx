import {
  FileBarChart,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface Props {
  files: File[]
}

export const FilesDisplay = ({ files }: Props) => {
  return (
    <div className="shadow-2xl divide-slate-600 bg-slate-50 shadow-black/60 rounded-2xl flex flex-col p-5 items-start space-x-0 max-w-full overflow-hidden duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-2">
      <div className="flex justify-between items-center w-full mb-5">
        <h2 className="text-base font-bold">Files to Upload</h2>
        <Badge>
          {files.length} File{files.length > 1 ? "s" : ""}
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {files.map((file) => (
          <div
            key={`file-${file.name}-${file.size}`}
            className="flex items-center gap-2 w-full"
          >
            {getFileLogo(file.name)}
            <div>
              <p className="text-sm font-medium">{getFileName(file.name)}</p>
              <span className="text-xs text-slate-500">
                {getFileSize(file.size)}
              </span>
            </div>
          </div>
        ))}
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

const getFileName = (name: string) => {
  // cut the name if it's too long but keep the extension
  const ext = name.split(".").pop()
  const cutName = name.slice(0, 20)
  if (cutName.length < name.length) {
    return `${cutName}...${ext}`
  }
  return name
}

const getFileSize = (size: number) => {
  const kb = size / 1000
  const mb = kb / 1000
  if (mb > 1) return `${mb.toFixed(2)} MB`
  return `${kb.toFixed(2)} KB`
}
