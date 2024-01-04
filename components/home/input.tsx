"use client"

import { useRef, type ChangeEventHandler, type FormEventHandler, useEffect } from "react"
import { ClipboardCheckIcon, SendIcon, UploadIcon } from "lucide-react"

import { useInputStore } from "@/lib/store"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { useToast } from "../ui/use-toast"
import { FilesDisplay } from "./file/files-display"
import { cn } from "@/lib/utils"

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
    const maxFiles = 4
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

      const textarea = document.getElementById('textarea-input');
      
      if (textarea) {
        // Trigger the input event manually
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
      }
    })
  }

  useEffect(() => {
    if (value && textareaRef.current) {
      const event = new Event('input', { bubbles: true });
      textareaRef.current.dispatchEvent(event);
    }
  }, [value]);

  return (
    <div className="grid gap-7.5 max-w-[90%] sm:max-w-lg m-auto">
      <div className="overflow-hidden flex flex-col w-full shadow-lg divide-slate-600 min-h-12 bg-slate-50 shadow-black/40 rounded-2xl transition-all">
        <div className="flex w-full transition-all duration-300 min-h-full h-fit">
          <textarea
            id="textarea-input"
            ref={textareaRef}
            placeholder="Type in link or text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full disabled:opacity-80 text-primary text-sm bg-transparent border-0 shadow-none resize-none outline-none ring-0 disabled:bg-transparent selection:bg-blue-200 selection:text-black placeholder:text-slate-500 [scroll-padding-block:0.75rem] pr-2 leading-relaxed py-3 pl-2.5 [&_textarea]:px-0"
            style={{
              colorScheme: "dark",
            }}
            rows={1}
            onInput={handleTextAreaResize}
          />
          <div className="flex items-center pr-2.5">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div onClick={handlePaste} className="cursor-pointer rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7">
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
                  <div className={cn(
                    "rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7",
                    Boolean(value.trim()) ? "cursor-pointer" : "hover:bg-transparent text-primary/40"
                    )}>
                    <SendIcon size={16} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-50">
                  Send
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      {!!files?.length ? <FilesDisplay files={files} /> : null}
    </div>
  )
}

// export const SourceInput = () => {
//   return (
//     <div className="overflow-hidden max-w-[90%] z-10 flex flex-col w-full sm:max-w-lg m-auto shadow-lg divide-slate-600 min-h-12 bg-slate-100 shadow-black/40 rounded-[24px]">
//       <div className="height: 0px; transform-origin: 50% 50% 0px;" />
//       <div className="flex items-center flex-1 min-w-0 px-3 md:pl-4 bg-slate-100 relative z-10">
//         <form>
//           <div
//             className="relative w-full flex items-center transition-all duration-300 min-h-full h-fit"
//             style={{ height: "47px" }}
//           >
//             <label htmlFor="textarea-input" className="sr-only">
//               Data Source
//             </label>
//             <div className="relative flex flex-1 min-w-0 self-start">
//               <div className="flex-[1_0_50%] min-w-[50%] overflow-x-visible -ml-[100%] opacity-0 invisible pointer-events-none" />
//               <textarea
//                 placeholder="Your data source"
//                 className="flex-[1_0_50%] min-w-[50%] disabled:opacity-80 text-primary text-sm bg-transparent border-0 shadow-none resize-none outline-none ring-0 disabled:bg-transparent selection:bg-blue-200 selection:text-black placeholder:text-slate-700 [scroll-padding-block:0.75rem] pr-2 leading-relaxed py-3 pl-1 [&_textarea]:px-0"
//                 style={{
//                   colorScheme: "dark",
//                   height: "47px",
//                 }}
//               />
//             </div>
//             <div className="flex items-center"></div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
