import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="bg-white text-black">
      <div className="mx-auto py-6 px-12 flex flex-col md:flex-row justify-between items-start border-t border-gray-300">
        <div>
          <h2 className="text-lg font-medium mb-2">Follow Us</h2>
          <div className="flex space-x-4">
          <Link className="text-sm block mb-1 hover:underline" href="#">
            Twitter
          </Link>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <h2 className="font-medium mb-2">Resources</h2>
          <Link className="text-sm block mb-1 hover:underline" href="#">
            About
          </Link>
          <Link className="text-sm block mb-1 hover:underline" href="#">
            Tutorial
          </Link>
        </div>
      </div>
      <div className="container mx-auto p-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} sapientor. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link className="text-sm hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm hover:underline" href="#">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
