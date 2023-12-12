import { Footer } from "@/components/layout/footer"

export default function Page() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-20 min-h-screen">
        <section className="mb-20">
          <h1 className="mb-5 text-2xl font-medium sm:text-3xl">About</h1>
          <p className="mb-2.5">
            This app is a realm of exploration, a venture into the elegance of
            simplicity. Simply delineate your current stance and your envisioned
            horizon, and together, we shall endeavor to bridge the divide.
          </p>
          <p className="mb-2.5">
            If it succeeds, our gratitude will know no bounds. If not, at least
            may your journey yield newfound self-awareness along the way.
          </p>
          <p className="mb-2.5">
            Delve into a dialogue with your prospective self, explore the
            uncharted territories of your future aspirations. As you traverse
            through the realms of what-could-be, may the discourse with your
            future self illuminate the path, unveiling the tapestry of
            possibilities that await.
          </p>
          <p className="mb-2.5">
            Each interaction is a step forward, a leap towards the realm of
            self-realization, a dance with destiny. Our endeavor is to create a
            sanctuary of reflection, where imagination meets aspiration, forging
            the narrative of tomorrow.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
