"use client"

import React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

const PlayCircleIcon = dynamic(() =>
  import("lucide-react").then((mod) => mod.PlayCircleIcon)
)
const StopCircleIcon = dynamic(() =>
  import("lucide-react").then((mod) => mod.StopCircleIcon)
)
const CardContainer = dynamic(
  () => import("../ui/3d-card").then((mod) => mod.CardContainer),
  {
    loading: () => <ImageLoader />,
  }
)
const CardBody = dynamic(() =>
  import("../ui/3d-card").then((mod) => mod.CardBody)
)

export function AppPreviewCard() {
  const [playVideo, setPlayVideo] = React.useState(false)
  return (
    <CardContainer className="inter-var">
      <CardBody
        onClick={() => setPlayVideo(!playVideo)}
        className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full max-w-2xl h-auto rounded-xl border "
      >
        {playVideo ? (
          <video
            src="/website-demo-hq.mp4"
            height="1000"
            width="1000"
            className="h-96 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            autoPlay
            loop
          />
        ) : (
          <Image
            src="/screenshot.png"
            height="1000"
            width="1000"
            className="h-96 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        )}
        <div className="absolute top-0 left-0 rounded-xl w-full h-full opacity-0 bg-slate-400 bg-opacity-50 group-hover/card:opacity-100 flex transition-opacity justify-center items-center flex-col gap-1 text-white">
          {playVideo ? (
            <StopCircleIcon size={32} />
          ) : (
            <PlayCircleIcon size={32} />
          )}
          {playVideo ? "Stop video" : "Play video"}
        </div>
      </CardBody>
    </CardContainer>
  )
}

const ImageLoader = () => {
  return (
    <div className="w-full max-w-2xl h-auto rounded-xl border ">
      <Image
        src="/screenshot.png"
        height="1000"
        width="1000"
        className="h-96 w-full object-cover rounded-xl"
        alt="thumbnail"
        priority
      />
    </div>
  )
}
