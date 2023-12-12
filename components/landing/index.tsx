import { Benefits } from "./benefits"
import { HeroBanner } from "./hero-banner"
import { Pricing } from "./pricing"

export const Landing = () => {
  return (
    <div className="grid gap-24">
      <HeroBanner />
      <Benefits />
      <Pricing />
    </div>
  )
}
