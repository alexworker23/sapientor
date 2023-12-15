export const DataSources = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto grid items-center gap-6 py-12 lg:grid-cols-2 lg:gap-40">
          <img
            src="/links-illustrations.png"
            alt="Links parsing illustration"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            height="310"
            width="550"
          />
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-xl font-bold">Links</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Supply links to the content you are interested in and we will
              parse it for you. After that, you can use it in your Knowledge
              Hub.
            </p>
          </div>
        </div>
        <div className="mx-auto grid items-center gap-6 py-12 lg:grid-cols-2 lg:gap-40">
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-xl font-bold">Files</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Upload files containing large chunks of data to your Knowledge Hub
            </p>
          </div>
          <img
            alt="Files parsing illustration"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            height="310"
            src="/files-illustration.png"
            width="550"
          />
        </div>
        <div className="mx-auto grid items-center gap-6 py-12 lg:grid-cols-2 lg:gap-40">
          <img
            alt="Text parsing illustration"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            height="310"
            src="/text-illustration.png"
            width="550"
          />
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-xl font-bold">Notes</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Any of your hand-written notes can be added to your Knowledge Hub
              as well.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
