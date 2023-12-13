import { Footer } from "@/components/layout/footer"

export default function Page() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-20 min-h-screen">
        <section className="mb-20">
          <h1 className="mb-5 text-2xl font-medium sm:text-3xl">About</h1>
          <p className="mb-2.5">
            The appearance of this app is driven by the speed of AI development
            and adoption. Even now in December 2023 the latest LLM which is
            connected to internet is much more smarter than any individual
            human. So what makes us special? What is the thing that we as humans
            posses and that other humans might need from us? It is our vision of
            the world and the contexts we are living in. In my opinion these
            things makes us special and help us be successful in life.
          </p>
          <p className="mb-2.5">
            So what if we can provide what we collect anything that we find
            interesting, cool, stylish, meaningful into our own Knowledge Hub
            that is later inserted into any AI assistant of our choice? It can
            help us make better decisions in the same context as we live and
            think.
          </p>
          <p className="mb-2.5">
            I am very much aware of the currently existing hardware and software
            companies that are collecting the data of your life in the
            background. But I personally find it somewhat strange to have some
            software or hardware constantly having access to my talks with other
            people, having access to me screen, etc. That is why I think that we
            should be able to individually select which data will be a part of
            our AI powered life and which not.
          </p>
          <p className="mb-2.5">
            Also with the raise of AI giants like OpenAI, Antrophic, etc - it is
            very easy to become locked into a certain suite of software. You
            cannot know exactly which company will succeed and which one will
            fail in the future, thus making your data inaccessible. That is why
            I think that we should be able to export our data from one AI
            assistant to another and make full control over our own contexts at
            any time.
          </p>
          <p>
            All of the points described above are the main reasons for the
            existance of this app. The app where you are no longer obliged to
            parse data on your own, create documents that will fit into the
            right AI chatbot. Now you can just insert the link for a news or
            article you are interested in, or a video, or a podcast and be sure
            that this data will be parsed on its own and added into your
            Knowledge Hub. Later you can use this data to train your own AI
            assistant or just use it as a personal knowledge base either through
            our integrations like a Custom GPT, or by just downloading a file
            that contains all the data parsed until that moment.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
