"use client"

import { CheckCircle } from "lucide-react"

import { useInputStore } from "@/lib/store"

export const SuccessMessage = () => {
  const { successMessage } = useInputStore()
  return (
    <div className="flex items-center gap-2.5 p-2.5">
      <CheckCircle className="text-green-600" size={24} />
      <div>
        <h4 className="text-sm font-medium">Success 🎉</h4>
        <p className="text-xs">{successMessage}</p>
      </div>
    </div>
  )
}
