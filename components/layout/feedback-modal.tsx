"use client"

import { FormEventHandler, useState } from "react"
import { Loader2, MessageCircle } from "lucide-react"
import Balancer from "react-wrap-balancer"

import { sendFeedbackEmail } from "@/app/actions/send-feedback-email"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

export const FeedbackModal = () => {
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      setLoading(true)
      const response = await sendFeedbackEmail(formData)
      if (response.success) {
        toast({
          title: "Feedback sent",
          description: "Thank you for your feedback!",
        })
        setEmailSent(true)
      } else {
        toast({
          title: "Something went wrong",
          description: response.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex justify-between"
        >
          <span>Feedback</span>
          <MessageCircle size={16} className="ml-2" />
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>
            <Balancer>
              Share your thoughts, request new features or report issues to help
              us improve. Your feedback is valuable to us.
            </Balancer>
          </DialogDescription>
        </DialogHeader>
        {emailSent ? (
          <div>
            <p className="mt-2.5 text-center">
              <Balancer>
                Your feedback has been sent! We are grateful for your
                contribution.
              </Balancer>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-2.5 grid space-y-2.5">
            <Textarea
              name="content"
              placeholder="Write your feedback here"
              className="min-h-[100px] max-h-[320px]"
              readOnly={loading}
            />
            <div className="flex justify-center">
              <Button type="submit" className="w-24 gap-1" disabled={loading}>
                {loading && <Loader2 size={16} className="animate-spin" />}
                Send
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
