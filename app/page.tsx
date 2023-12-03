import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/lib/database.types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
        <Tabs defaultValue="links" className="w-[400px]">
          <div className="flex justify-center mb-4">
            <TabsList className="w-[180px]">
              <TabsTrigger value="links" className="w-full">
                Links
              </TabsTrigger>
              <TabsTrigger value="chat" className="w-full">
                Chat
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="links">
            <LinkForm />
          </TabsContent>
          <TabsContent value="chat">
            {/* 
              Here at the top should be an ability to select a bot user will be communicating with.
              These should be round avatars with images. 
            */}
            {/* Below should be the chat window */}
            Chat here.
          </TabsContent>
        </Tabs>
      )}
    </main>
  )
}
