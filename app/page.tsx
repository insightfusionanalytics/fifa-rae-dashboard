import Link from "next/link";

const ANALYSES = [
  {
    title: "Relative Age Effect",
    href: "/rae",
    description:
      "Birth quarter bias in professional football. Chi-squared analysis across positions, leagues, and countries.",
    stats: "Q1: 33.8% vs expected 25%",
    icon: "📅",
  },
  {
    title: "Height Analysis",
    href: "/height",
    description:
      "Height distributions by position, country, and rating. Top-ranked vs all players comparison.",
    stats: "Avg height: 180.8 cm across 6 positions",
    icon: "📏",
  },
  {
    title: "Player Profile",
    href: "/profile",
    description:
      "Common characteristics, left-foot vs left-hand analysis, country representation, and split comparisons.",
    stats: "Left-footed: 22.1% vs 10.6% left-handed",
    icon: "👤",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="bg-navy text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-blue-300 mb-3">
            Insight Fusion Analytics
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            FIFA Player Analysis
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Interactive analysis of 56,880 FIFA-rated players across 190
            countries and 44 leagues. FIFA 15 through FIFA 23.
          </p>
          <div className="mt-8 flex justify-center gap-8 text-sm">
            <div>
              <div className="text-2xl font-bold">56,880</div>
              <div className="text-gray-400">Players</div>
            </div>
            <div>
              <div className="text-2xl font-bold">190</div>
              <div className="text-gray-400">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold">44</div>
              <div className="text-gray-400">Leagues</div>
            </div>
            <div>
              <div className="text-2xl font-bold">9</div>
              <div className="text-gray-400">FIFA Versions</div>
            </div>
          </div>
        </div>
      </header>

      {/* Analysis Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
          {ANALYSES.map((analysis) => (
            <Link
              key={analysis.href}
              href={analysis.href}
              className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-navy/20 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{analysis.icon}</div>
              <h2 className="text-lg font-bold text-navy group-hover:text-blue-600 transition-colors mb-2">
                {analysis.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {analysis.description}
              </p>
              <div className="text-xs font-medium text-navy/70 bg-gray-50 rounded-lg px-3 py-2">
                {analysis.stats}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-gray-400 border-t border-gray-100">
        <p>FIFA Player Analysis — Insight Fusion Analytics — 2026</p>
        <p className="mt-1">
          Data sourced from EA Sports FIFA series. For research purposes only.
        </p>
      </footer>
    </main>
  );
}
