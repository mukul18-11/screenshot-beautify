export const FAQS = [
  {
    question: "What is Screenshot Beautifier?",
    answer:
      "Screenshot Beautifier is a browser-based tool for turning product screenshots into polished launch graphics with quick styles, browser frames, text overlays, depth, and PNG export.",
  },
  {
    question: "Do screenshots upload to a server?",
    answer:
      "No. Screenshot Beautifier handles the image in your browser for this MVP.",
  },
  {
    question: "What file types can I use?",
    answer: "PNG, JPG, and WebP screenshots up to 10 MB are supported.",
  },
  {
    question: "Can I export for social posts and landing pages?",
    answer:
      "Yes. Use built-in canvas sizes and export sharp PNGs for X, LinkedIn, Product Hunt, decks, and hero images.",
  },
  {
    question: "Who is it for?",
    answer:
      "It is built for founders, makers, marketers, and product teams who need polished screenshots for launches, changelogs, demos, and social posts.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. The editor runs locally in your browser and does not require login.",
  },
] as const;

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold text-cyan-700">FAQ</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-[2rem]">
          Practical answers before you start
        </h2>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
        {FAQS.map((faq) => (
          <div
            key={faq.question}
            className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur-xl"
          >
            <h3 className="text-base font-semibold text-slate-950">
              {faq.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
