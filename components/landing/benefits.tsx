import Link from "next/link"
import { GaugeIcon, LightbulbIcon, ShieldIcon } from "lucide-react"

import { Card, CardContent } from "../ui/card"

export const Benefits = () => {
  return (
    <div className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 lg:px-8 mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Streamline Your Data with AI Flexibility
          </h2>
          <p className="max-w-[600px] text-gray-500 mx-auto md:text-lg">
            Experience effortless data management and unparalleled integration
            freedom with our AI-driven platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="flex flex-col items-center space-y-4 p-4">
              <LightbulbIcon className="w-10 h-10 text-yellow-500" />
              <h3 className="text-lg font-medium">AI Interconnectivity</h3>
              <p className="text-gray-500 text-center">
                Break free from vendor lock-in. Our system ensures your data
                flows smoothly between the AI services you choose.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center space-y-4 p-4">
              <GaugeIcon className="w-10 h-10 text-blue-500" />
              <h3 className="text-lg font-medium">Seamless Data Parsing</h3>
              <p className="text-gray-500 text-center">
                Post links, files, or text - our platform takes care of the
                rest, seamlessly organizing your data into your Knowledge Hub.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center space-y-4 p-4">
              <ShieldIcon className="w-10 h-10 text-green-500" />
              <h3 className="text-lg font-medium">Complete Data Sovereignty</h3>
              <p className="text-gray-500 text-center">
                Your data, your rules. Enjoy the power to access, download, and
                delete your information on demand.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center">
          <Link
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="/about"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}
