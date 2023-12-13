import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="bg-white text-black container">
      <div className="mx-auto py-6 md:px-12 flex flex-row justify-between items-start border-t border-gray-300">
        <div>
          <h2 className="text-lg font-medium mb-2">Follow Us</h2>
          <div className="flex space-x-4">
            <a
              className="text-sm block mb-1 hover:underline"
              href="https://twitter.com/valoiscene"
            >
              Twitter
            </a>
          </div>
        </div>
        <div className="">
          <h2 className="font-medium mb-2">Resources</h2>
          <Link className="text-sm block mb-1 hover:underline" href="/about">
            About
          </Link>
          <Link className="text-sm block mb-1 hover:underline" href="/tutorial">
            Tutorial
          </Link>
        </div>
      </div>
      <div className="container mx-auto p-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} sapientor. All rights reserved.
        </p>
        {/* <div className="flex justify-center space-x-4 mt-2">
          <Link className="text-sm hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm hover:underline" href="#">
            Privacy Policy
          </Link>
        </div> */}
      </div>
    </footer>
  )
}
