import { SVGProps } from "react"
import Link from "next/link"

import { AuthModal } from "../auth/modal"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

export const Landing = () => {
  return (
    <div className="grid gap-24">
      <div className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:gap-12 grid-cols-2">
            <div className="bg-slate-100 w-full h-[360px] rounded-lg" />
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Introducing <span className="underline">Sapientor</span>
                </h2>
                <p className="max-w-xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Paste links to gather information into a personalized hub.
                  Organize and access your knowledge easily, use it
                  interactively with chat interfaces, or download it for later
                  reference.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button variant="outline">Watch Now</Button>
                <AuthModal
                  buttonLabel="Get Started"
                  variant="default"
                  className="text-base"
                  size="default"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 lg:px-8 mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Enhance Your Workflow with Our AI Product
            </h2>
            <p className="max-w-[600px] text-gray-500 mx-auto md:text-lg">
              Discover how our innovative AI solutions can transform your
              business operations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-4">
                <LightbulbIcon className="w-10 h-10 text-yellow-500" />
                <h3 className="text-lg font-medium">Innovative Solutions</h3>
                <p className="text-gray-500 text-center">
                  Our AI provides innovative solutions to complex problems.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-4">
                <GaugeIcon className="w-10 h-10 text-blue-500" />
                <h3 className="text-lg font-medium">Increase Efficiency</h3>
                <p className="text-gray-500 text-center">
                  Boost your productivity and operational efficiency.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-4">
                <ShieldIcon className="w-10 h-10 text-green-500" />
                <h3 className="text-lg font-medium">Secure and Reliable</h3>
                <p className="text-gray-500 text-center">
                  Trust in our secure and reliable AI system.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center">
            <Link
              className="inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="#"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      <div key="1" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 grid gap-5">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
            Customer Reviews
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 text-center">
            Hear from our happy customers
          </p>
          <div className="mx-auto px-4 md:px-6 max-w-2xl grid gap-12 mt-10">
            <Card>
              <CardContent className="flex gap-4 pt-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage
                    alt="@shadcn"
                    src="/placeholder.svg?height=40&width=40"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="grid gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="grid gap-0.5 text-sm">
                      <h3 className="font-semibold">Sarah Johnson</h3>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        2 days ago
                      </time>
                    </div>
                    <div className="flex items-center gap-0.5 ml-auto">
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                      <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-sm leading-loose text-gray-500 dark:text-gray-400">
                    <p>
                      I&apos;ve been using this product for a while now, and it&apos;s
                      been a great addition to my routine. The quality is
                      exceptional and the customer service is top-notch. I would
                      highly recommend it!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex gap-4 pt-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage
                    alt="@shadcn"
                    src="/placeholder.svg?height=40&width=40"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="grid gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="grid gap-0.5 text-sm">
                      <h3 className="font-semibold">Alex Smith</h3>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        3 weeks ago
                      </time>
                    </div>
                    <div className="flex items-center gap-0.5 ml-auto">
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                      <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-sm leading-loose text-gray-500 dark:text-gray-400">
                    <p>
                      I recently purchased the product, and it has been a
                      game-changer in my life. It&apos;s incredibly efficient and
                      easy to use. The only reason I didn&apos;t give it a perfect
                      5-star rating is because it took a while to arrive. But
                      overall, it&apos;s been a great experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* <div className=" p-6 rounded-lg text-center h-screen flex flex-col justify-center items-center space-y-4">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">No Reviews Yet</h3>
          <p className="text-gray-500 mb-6 text-lg">Be the first to review our product. Your feedback matters to us.</p>
          <Button className="w-full md:w-auto text-white" type="submit">
            Write a Review
          </Button>
          <SmileIcon className="w-12 h-12 text-yellow-500" />
        </div> */}
        </div>
      </div>
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
                    <span>5 Projects</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    <span>10GB Storage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    <span>Basic Support</span>
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
                    <span>Unlimited Projects</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    <span>100GB Storage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    <span>Premium Support</span>
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
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-sm text-gray-500 mb-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="flex flex-col space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    <span>Unlimited Projects</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    <span>Unlimited Storage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    <span>24/7 Support</span>
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
    </div>
  )
}

function GaugeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  )
}

function LightbulbIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}

// function SmileIcon(props: SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="12" cy="12" r="10" />
//       <path d="M8 14s1.5 2 4 2 4-2 4-2" />
//       <line x1="9" x2="9.01" y1="9" y2="9" />
//       <line x1="15" x2="15.01" y1="9" y2="9" />
//     </svg>
//   )
// }

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
