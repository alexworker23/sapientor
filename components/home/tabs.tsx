"use client"

import { home_tab_cookie_name } from "@/lib/utils"
import { storeTabChoice } from "@/app/actions/store-tab-choice"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { FileForm } from "./file/form"
import { LinkForm } from "./link/form"
import { TextForm } from "./text/form"

export interface HomeUserTabsProps {
  defaultTab: string | undefined
}

export const HomeUserTabs = ({ defaultTab = "add" }: HomeUserTabsProps) => {
  const handleChange = (value: string) => {
    const formData = new FormData()
    formData.append("name", home_tab_cookie_name)
    formData.append("value", value)
    storeTabChoice(formData)
  }

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleChange}>
      <div className="flex justify-center my-4">
        <TabsList className="w-[280px]">
          <TabsTrigger value="add" className="w-full">
            Link
          </TabsTrigger>
          <TabsTrigger value="file" className="w-full">
            File
          </TabsTrigger>
          <TabsTrigger value="note" className="w-full">
            Note
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="add" className="w-[400px]">
        <LinkForm />
      </TabsContent>
      <TabsContent value="file" className="w-[400px]">
        <FileForm />
      </TabsContent>
      <TabsContent value="note" className="w-[400px]">
        <TextForm />
      </TabsContent>
    </Tabs>
  )
}
