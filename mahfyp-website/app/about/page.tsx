import Link from "next/link";

const TEAM = [
  {
    name: "Mahnoor",
    photo: "/mahnoor.png",
    heading: "ML Engineer & Cosmetics Expert",
    paragraph:
      "Mahnoor led the machine learning pipeline for this project — from scraping and cleaning product data across top Pakistani skincare brands, to building the ingredient-based skin type classifier. Her dual expertise in both cosmetic science and data engineering made it possible to bridge the gap between beauty knowledge and AI. She designed the recommendation logic that lies at the heart of MahMetics, ensuring that every suggestion is grounded in real ingredient science.",
  },
  {
    name: "Ali Imran",
    photo: "/ali.png",
    heading: "Frontend & Backend Developer",
    paragraph:
      "Ali Imran architected and built the full-stack web application — from the responsive Next.js frontend to the Supabase backend, admin dashboard, and ecommerce functionality. He translated the project's ML outputs into a seamless user experience, ensuring the skin advisor quiz, product browsing, cart, and order management system all work together smoothly. His engineering work brought the entire vision to life on the web.",
  },
  {
    name: "Muhammad Faiez",
    photo: "/faiez.png",
    heading: "Project Supervisor",
    paragraph:
      "This project was completed under the supervision of Muhammad Faiez at the Department of CS&IT, University of Lahore. His academic guidance, structured feedback, and consistent oversight helped the team stay focused and deliver a technically sound final year project. His mentorship ensured that the project met both the academic standards and real-world applicability expected at the university level.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <section className="bg-plum-900 py-20">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gold mb-4">
            Final Year Project
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
            About MahMetics
          </h1>
          <p className="text-plum-200 text-lg leading-relaxed">
            MahMetics is an AI-powered skincare recommendation platform built
            as a Final Year Project at the{" "}
            <Link
              href="https://cs.uol.edu.pk"
              target="_blank"
              rel="dofollow"
              className="text-gold underline hover:brightness-110"
            >
              Department of CS&IT, University of Lahore
            </Link>
            . The platform uses machine learning to analyse cosmetic ingredients
            and recommend the most suitable local Pakistani skincare products
            based on a user&apos;s skin type and concerns — making personalised
            skincare accessible and science-backed for everyone.
          </p>
        </div>
      </section>

      {/* What we built */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-3xl font-semibold text-plum-900 text-center mb-10">
            What We Built
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🤖",
                title: "ML Recommendation Engine",
                desc: "A multi-label classifier trained on 1,400+ labelled cosmetic products that predicts skin type suitability from ingredient lists.",
              },
              {
                emoji: "🇵🇰",
                title: "Local Product Database",
                desc: "Scraped and curated 150+ products from top Pakistani skincare brands with full ingredient transparency.",
              },
              {
                emoji: "🛍️",
                title: "Full Ecommerce Platform",
                desc: "A complete shopping experience with a skin quiz, product browsing, cart, COD checkout, and admin order management.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-cream rounded-2xl border border-plum-100 p-7 text-center"
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="font-semibold text-plum-900 mb-2">{item.title}</h3>
                <p className="text-sm text-plum-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-plum-900 mb-3">Meet the Team</h2>
            <p className="text-plum-500">The people behind MahMetics</p>
          </div>

          <div className="flex flex-col gap-16">

            {/* First 3 members from array */}
            {TEAM.map((member, index) => {
              const imageLeft = index % 2 === 0;
              return (
                <div
                  key={member.name}
                  className={`flex flex-col ${imageLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-10 items-center`}
                >
                  <div className="w-full md:w-5/12 shrink-0">
                    <div className="rounded-3xl overflow-hidden border border-plum-100 shadow-lg aspect-[3/4] bg-plum-50">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-7/12">
                    <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-2">
                      {member.heading}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-semibold text-plum-900 mb-4">
                      {member.name}
                    </h3>
                    <p className="text-plum-500 leading-relaxed text-base">
                      {member.paragraph}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Ahmad Zia — 4th member, image on right, link in paragraph */}
            <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
              <div className="w-full md:w-5/12 shrink-0">
                <div className="rounded-3xl overflow-hidden border border-plum-100 shadow-lg aspect-[3/4] bg-plum-50">
                  <img
                    src="/ahmad.png"
                    alt="M. Ahmad Zia"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="w-full md:w-7/12">
                <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-2">
                  Co-Supervisor & Mentor
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold text-plum-900 mb-4">
                  M. Ahmad Zia
                </h3>
                <p className="text-plum-500 leading-relaxed text-base">
                  The vision and direction of MahMetics would not have been
                  possible without the mentorship of M. Ahmad Zia. A recognized
                  expert in Ecommerce and Agentic AI for E-commerce (
                  <Link
                    href="https://ahmadzia.com"
                    target="_blank"
                    rel="dofollow"
                    className="text-plum-700 underline hover:text-plum-900"
                  >
                    ahmadzia.com
                  </Link>
                  ), his industry insight shaped every major decision in the
                  project — from the recommendation architecture to the
                  ecommerce integration strategy. He consistently pushed the
                  team to think beyond academics and build something that works
                  in the real world.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-plum-900 py-16">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Try the Skin Advisor
          </h2>
          <p className="text-plum-200 text-sm mb-6">
            Find your perfect skincare match based on your skin type and concerns.
          </p>
          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 bg-gold text-plum-900 font-semibold px-7 py-3 rounded-full hover:brightness-110 transition-all"
          >
            Start Skin Quiz →
          </Link>
        </div>
      </section>

    </div>
  );
}