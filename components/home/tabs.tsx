"use client"

import { home_tab_cookie_name } from "@/lib/utils"
import { storeTabChoice } from "@/app/actions/store-tab-choice"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { FileForm } from "./file/form"
import { LinkForm } from "./link/form"

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
            Link
          </TabsTrigger>
          <TabsTrigger value="file" className="w-full">
            File
          </TabsTrigger>
          <TabsTrigger value="text" className="w-full">
            Text
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="add" className="w-[400px]">
        <LinkForm />
      </TabsContent>
      <TabsContent value="file" className="w-[400px]">
        <FileForm />
      </TabsContent>
      <TabsContent value="text" className="w-[400px]">
        Text window
      </TabsContent>
    </Tabs>
  )
}
