"use client"

import { home_tab_cookie_name } from "@/lib/utils"
import { storeTabChoice } from "@/app/actions/store-tab-choice"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Chat } from "./chat"
import { LinkForm } from "./link-form"

interface Props {
  defaultTab: string | undefined
}

export const HomeUserTabs = ({ defaultTab = "add" }: Props) => {
  const handleChange = (value: string) => {
    const formData = new FormData()
    formData.append("name", home_tab_cookie_name)
    formData.append("value", value)
    storeTabChoice(formData)
  }

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleChange}>
      <div className="flex justify-center mb-4">
        <TabsList className="w-[180px]">
          <TabsTrigger value="add" className="w-full">
            Add
          </TabsTrigger>
          <TabsTrigger value="chat" className="w-full">
            Chat
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="add" className="w-[400px]">
        <LinkForm />
      </TabsContent>
      <TabsContent value="chat" className="w-[600px]">
        {/* 
              Here at the top should be an ability to select a bot user will be communicating with.
              These should be round avatars with images. 
            */}
        <Chat />
      </TabsContent>
    </Tabs>
  )
}
