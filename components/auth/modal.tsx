"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MailCheck } from "lucide-react"
import { Balancer } from "react-wrap-balancer"

import { Button, type ButtonProps } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { GoogleSignInButton } from "./google-button"
import { LogInForm } from "./log-in-form"
import { OrDivider } from "./or-divider"

export interface AuthModalProps extends ButtonProps {
  buttonLabel?: string
}

export const AuthModal = ({
  buttonLabel = "Log in",
  ...props
}: AuthModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const searchParams = useSearchParams()
  const isLoginRedirect = searchParams.get("login") === "true"
  const redirectTo = searchParams.get("redirect")

  useEffect(() => {
    if (isLoginRedirect) {
      setIsOpen(true)
    }
  }, [isLoginRedirect])

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <div className="relative group">
        <div className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100">
          <div className="shadow-lg h-full w-full rounded-full"></div>
        </div>
        <div className="relative transition-transform transform group-hover:scale-105">
          <Button
            onClick={() => setIsOpen(true)}
            type="button"
            variant="secondary"
            className="text-sm rounded-full px-5 shadow-inner hover:shadow-md transition-all hover:bg-secondary"
            size="sm"
            {...props}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
      <DialogContent
        className="gap-5"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>
            <Balancer>
              In order to use sapientor you need to authorise first.
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
            <LogInForm
              redirectTo={redirectTo}
              setIsEmailSent={setIsEmailSent}
            />
            <OrDivider />
            <div className="flex justify-center">
              <GoogleSignInButton redirectTo={redirectTo} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
