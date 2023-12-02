"use client"

import { useState } from "react"
import { MailCheck } from "lucide-react"
import Balancer from "react-wrap-balancer"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { GoogleSignInButton } from "./google-button"
import { LogInForm } from "./log-in-form"
import { OrDivider } from "./or-divider"

export const AuthModal = () => {
  const [isEmailSent, setIsEmailSent] = useState(false)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-sm" size="sm">
          Log in
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5">
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>
            <Balancer>
              In order to store your personal data permanently you need to log
              in.
            </Balancer>
          </DialogDescription>
        </DialogHeader>
        {isEmailSent ? (
          <div className="flex flex-col items-center">
            <MailCheck
              size={40}
              className="text-green-600 mb-2"
              strokeWidth={1.5}
            />
            <p className="text-center text-xl">
              <Balancer>
                We have sent you an email with a login link. Be sure to check
                your spam too.
              </Balancer>
            </p>
          </div>
        ) : (
          <>
            <LogInForm setIsEmailSent={setIsEmailSent} />
            <OrDivider />
            <div className="flex justify-center">
              <GoogleSignInButton />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
