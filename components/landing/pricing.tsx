import { CheckIcon, InfinityIcon } from "lucide-react"

import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

export const Pricing = () => {
  return (
    <div className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose your plan
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Choose the best plan that fits your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <div className="flex items-end justify-center py-4">
                <span className="text-3xl font-bold">Free</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="flex flex-col space-y-1">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  <span>10 Links per day / 100 Links totally</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  <span>4 Files per day / 20 Files totally</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  <span>
                    <InfinityIcon size={16} className="inline" /> Notes per day
                    / 300 Notes totally
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>
                Default
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <div className="flex items-end justify-center py-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-sm text-gray-500 mb-1">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="flex flex-col space-y-1">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  <span>50 Links per day / 1000 Links totally</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  <span>10 Files per day / 100 Files totally</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  <span>
                    <InfinityIcon size={16} className="inline" /> Notes per day
                    / 2000 Notes totally
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Select Plan</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <div className="flex items-end justify-center py-4">
                <span className="text-3xl font-bold">from $99</span>
                <span className="text-sm text-gray-500 mb-1">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="flex flex-col space-y-1">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  <span>Unlimited Links</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  <span>Unlimited Files & Notes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  <span>Shareable Knowledge Hub</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Select Plan</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
