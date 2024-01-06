import { Landing } from "@/components/landing"
import { Footer } from "@/components/layout/footer"

export default async function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between py-16 sm:p-16">
        <Landing />
      </main>
      <Footer />
    </>
  )
}
