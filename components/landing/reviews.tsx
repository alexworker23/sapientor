import { SmileIcon, StarIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

export const Reviews = () => {
  return (
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
                    I&apos;ve been using this product for a while now, and
                    it&apos;s been a great addition to my routine. The quality
                    is exceptional and the customer service is top-notch. I
                    would highly recommend it!
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
      </div>
    </div>
  )
}

export const EmptyReviews = () => {
  return (
    <div className=" p-6 rounded-lg text-center h-screen flex flex-col justify-center items-center space-y-4">
      <h3 className="text-2xl font-semibold mb-4 text-blue-600">
        No Reviews Yet
      </h3>
      <p className="text-gray-500 mb-6 text-lg">
        Be the first to review our product. Your feedback matters to us.
      </p>
      <Button className="w-full md:w-auto text-white" type="submit">
        Write a Review
      </Button>
      <SmileIcon className="w-12 h-12 text-yellow-500" />
    </div>
  )
}
