"use client"

import { FormEventHandler, useState } from "react"
import { Loader2 } from "lucide-react"

import { useToast } from "../ui/use-toast"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/database.types"

interface Props {
  setIsEmailSent: (value: boolean) => void
}

export const LogInForm = ({ setIsEmailSent }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const supabase = createClientComponentClient<Database>()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    const data = new FormData(event.currentTarget)
    const email = (data.get("email") as string) || ""

    try {
      if (!email) {
        setIsLoading(false)
        return toast({
          title: "Please enter your email.",
          description: "We need your email to send you a login link.",
          variant: "destructive",
        })
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.origin}/auth/callback`,
        },
      })

      if (!error) {
        setIsLoading(false)
        return toast({
          title: "Something went wrong.",
          description: "Your sign in request failed. Please try again.",
          variant: "destructive",
        })
      }

      setIsLoading(false)
      setIsEmailSent(true)
      return toast({
        title: "Check your email",
        description:
          "We sent you a login link. Be sure to check your spam too.",
      })
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      })
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start gap-2.5 sm:flex-row sm:px-10"
    >
      <Input name="email" placeholder="email@example.com" type="text" />
      <Button
        disabled={isLoading}
        type="submit"
        className="mx-auto w-40 gap-1 sm:mx-0 sm:w-32"
      >
        {isLoading && <Loader2 className="animate-spin" size={16} />}
        Log in
      </Button>
    </form>
  )
}
