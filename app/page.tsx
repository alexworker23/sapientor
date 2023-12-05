import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chat } from "@/components/home/chat"
import { LinkForm } from "@/components/home/link-form"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export default async function Home() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      {!user && (
        <h1 className="text-3xl">Welcome to your Personal Assistant!</h1>
      )}
      {user && (
        <Tabs defaultValue="add">
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
      )}
    </main>
  )
}
