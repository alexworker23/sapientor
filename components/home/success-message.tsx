import { CheckCircle } from "lucide-react"

import { Button } from "../ui/button"

interface Props {
  type: "link" | "file" | "text"
  handleClose: () => void
}

export const SuccessMessage = ({ type, handleClose }: Props) => {
  const text = getText(type)
  return (
    <div className="animate-in slide-in-from-top-2 w-full">
      <div className="flex justify-center mb-1">
        <CheckCircle className="text-green-600" size={32} />
      </div>
      <p className="text-center mb-4">{text}</p>
      <div className="flex justify-center">
        <Button type="button" onClick={handleClose}>
          Add another {type}
        </Button>
      </div>
    </div>
  )
}

const getText = (type: "link" | "file" | "text") => {
  switch (type) {
    case "link":
      return "Link been send to the processing queue. You can check the status of the link in your Knowledge Hub page."
    case "file":
      return "File been send to the processing queue. You can check the status of the file in your Knowledge Hub page."
    case "text":
      return "Text been send to the processing queue. You can check the status of the text in your Knowledge Hub page."
  }
}
