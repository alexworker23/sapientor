import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Header />
      <h1 className="text-3xl">
        Welcome to your Personal Assistant!
      </h1>
    </main>
  )
}
