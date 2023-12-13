import { Footer } from "@/components/layout/footer"

export default function Page() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-20 grid gap-5">
        <h1 className="text-2xl font-medium sm:text-3xl mb-2.5">
          Privacy Policy for Sapientor API
        </h1>
        <section>
          <h2 className="text-xl font-medium sm:text-2xl mb-2.5">
            Introduction
          </h2>
          <p>
            This Privacy Policy outlines the types of personal information
            collected by the Sapientor API, its usage, and protection. Our
            commitment is to ensure the confidentiality and security of our
            users' data.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-medium sm:text-2xl mb-2.5">
            Information Collection
          </h2>
          <ul className="list-disc list-inside grid gap-1.5">
            <li>
              <b>User Authentication Token</b>: For user authorization and
              access to services.
            </li>
            <li>
              <b>User ID and Email</b>: Collected during the authorization
              process for identification and communication purposes.
            </li>
            <li>
              <b>Knowledge Summaries and User Content</b>: Includes summaries,
              URLs, titles, and content provided by users.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-medium sm:text-2xl mb-2.5">
            Use of Information
          </h2>
          <p>The collected information is used to:</p>
          <ul className="list-disc list-inside grid gap-1.5">
            <li>
              Authenticate and provide access to the Sapientor API services.
            </li>
            <li>Maintain and improve the functionality of the API.</li>
            <li>Communicate with users for service-related purposes.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-medium sm:text-2xl mb-2.5">
            Sharing of Information
          </h2>
          <ul className="list-disc list-inside grid gap-1.5">
            <li>
              We do not sell or rent personal information to third parties.
            </li>
            <li>
              Information may be shared with third-party service providers to
              facilitate our services.
            </li>
            <li>
              We may disclose information if required by law or in response to
              legal requests.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-medium sm:text-2xl mb-2.5">
            Data Security
          </h2>
          <ul className="list-disc list-inside grid gap-1.5">
            <li>
              We implement security measures to protect against unauthorized
              access, alteration, disclosure, or destruction of personal data.
            </li>
            <li>
              Despite our efforts, no method of transmission over the Internet
              is completely secure.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-medium sm:text-2xl mb-2.5">
            User Rights
          </h2>
          <p>Users have the right to:</p>
          <ul className="list-disc list-inside grid gap-1.5">
            <li>Access personal information we hold about them.</li>
            <li>Request correction of incorrect or incomplete data.</li>
            <li>
              Request deletion of personal information, subject to legal and
              service requirements.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-medium sm:text-2xl mb-2.5">
            Changes to the Privacy Policy
          </h2>
          <p>
            We reserve the right to modify this policy. Users will be notified
            of significant changes.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-medium sm:text-2xl mb-2.5">
            Contact Information
          </h2>
          <p>
            For questions or concerns about this Privacy Policy, please contact
            us via email: valoiscene@gmail.com.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
