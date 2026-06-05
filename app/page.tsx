import Link from "next/link";
import {
  Leaf,
  MapPin,
  Camera,
  Brain,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Reports" },
  { value: "50+", label: "Hotspots Identified" },
  { value: "10+", label: "Cities" },
];

const steps = [
  {
    icon: Camera,
    title: "Citizen Reports",
    description:
      "Snap a photo of waste in your neighbourhood and pin the location on the map.",
  },
  {
    icon: Brain,
    title: "AI Analyzes",
    description:
      "Our AI classifies waste type, severity, and priority so authorities know what to fix first.",
  },
  {
    icon: ShieldCheck,
    title: "Authority Acts",
    description:
      "Municipal teams receive actionable alerts and track cleanup until the spot is resolved.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white text-gray-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16a34a]/10">
              <Leaf className="h-5 w-5 text-[#16a34a]" strokeWidth={2.25} />
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              SwachhMap
            </span>
          </Link>
          <Link
            href="/report"
            className="rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#15803d] sm:px-5 sm:py-2.5 sm:text-base"
          >
            Report Waste
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-gray-100">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(22,163,74,0.12),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#16a34a]/20 bg-[#16a34a]/5 px-4 py-1.5 text-sm font-medium text-[#16a34a]">
                <MapPin className="h-4 w-4" />
                Waste reporting for India
              </p>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Make Your City Clean &amp; Beautiful
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
                SwachhMap uses AI-powered waste reporting to help citizens flag
                problem spots and help municipal authorities respond faster —
                building cleaner streets across India.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/report"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#16a34a] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#15803d] sm:w-auto"
                >
                  Report Waste
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/map"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#16a34a] bg-white px-6 py-3.5 text-base font-semibold text-[#16a34a] transition-colors hover:bg-[#16a34a]/5 sm:w-auto"
                >
                  <MapPin className="h-4 w-4" />
                  View Map
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-gray-100 bg-gray-50/80">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-6 py-10 text-center sm:py-12"
              >
                <span className="text-3xl font-bold text-[#16a34a] sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm font-medium text-gray-600 sm:text-base">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                How it works
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-gray-600">
                From your phone to the cleanup crew — three simple steps to a
                cleaner community.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:mt-16 md:grid-cols-3 md:gap-6 lg:gap-10">
              {steps.map((step, index) => (
                <div key={step.title} className="flex flex-col">
                  <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
                    <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#16a34a] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#16a34a]/10">
                      <step.icon
                        className="h-7 w-7 text-[#16a34a]"
                        strokeWidth={2}
                      />
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="my-4 flex justify-center md:hidden">
                      <ArrowRight className="h-5 w-5 rotate-90 text-[#16a34a]/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 hidden items-center justify-center gap-2 text-sm font-medium text-gray-500 md:flex">
              <span>Citizen Reports</span>
              <ArrowRight className="h-4 w-4 text-[#16a34a]" />
              <span>AI Analyzes</span>
              <ArrowRight className="h-4 w-4 text-[#16a34a]" />
              <span>Authority Acts</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-[#16a34a]" />
            <span className="font-semibold text-gray-900">SwachhMap</span>
          </div>
          <p className="text-center text-sm text-gray-500 sm:text-right">
            © {new Date().getFullYear()} SwachhMap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
