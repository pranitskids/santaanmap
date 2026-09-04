import { useState } from "react";
import { santaanFaqData, santaanFaqCategories } from "../data/site";
import { HelpCircle, ArrowRight, Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQHub() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filtered = santaanFaqData.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = searchQuery === "" ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 px-6 pt-28 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <HelpCircle className="h-4 w-4" />
            Santaan Companion FAQ
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            QR, WhatsApp, Consult, And Patient-Mode Questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            The questions here are focused on how the Santaan Companion works in acquisition,
            follow-up, and care continuity, not generic IVF encyclopedia content.
          </p>
        </div>
      </section>

      {/* Search and filter */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/40 focus:outline-none focus:ring-1 focus:ring-blue-400/30"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {santaanFaqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/40"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">No questions found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq) => {
                const isOpen = openFaq === faq.q;
                return (
                  <div
                    key={faq.q}
                    className={`rounded-2xl border transition-all ${
                      isOpen ? "border-purple-400/30 bg-purple-950/30" : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.q)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-white/5 px-5 pb-4">
                        <p className="pt-3 text-sm leading-relaxed text-slate-300">{faq.a}</p>
                        <span className="mt-2 inline-block rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-slate-500">
                          {santaanFaqCategories.find((c) => c.id === faq.category)?.label || faq.category}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-gradient-to-b from-slate-900/30 to-slate-950 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Ready To Open A Live Topic Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Use the mobile-first home shell to test topic, source, awareness stage, patient stage,
            and WhatsApp handoff together.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40"
            >
              Open Companion Home <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/process"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Review Care Paths
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
