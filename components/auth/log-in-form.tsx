"use client"

import { FormEventHandler, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import { saveRedirectTo } from "@/app/actions/save-redirect-to"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useToast } from "../ui/use-toast"

interface Props {
  setIsEmailSent: (value: boolean) => void
  redirectTo?: string | null | undefined
}

export const LogInForm = ({ setIsEmailSent, redirectTo }: Props) => {
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

      if (redirectTo) {
        const redirectData = new FormData()
        redirectData.append("path", redirectTo)
        await saveRedirectTo(redirectData)
      }

      if (error) {
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
      className="flex flex-col items-start sm:flex-row sm:px-10 relative"
    >
      <Input
        name="email"
        placeholder="email@example.com"
        type="text"
        className="w-full"
      />
      <Button
        disabled={isLoading}
        type="submit"
        className="gap-1 rounded-l-none absolute right-0 sm:right-10 w-24 top-0"
      >
        {isLoading && <Loader2 className="animate-spin" size={16} />}
        Log in
      </Button>
    </form>
  )
}
