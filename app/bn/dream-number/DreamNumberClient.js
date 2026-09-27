"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { dreams } from "../../dream-number/dreams";

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

export default function DreamNumberClient() {
  const [query, setQuery] = useState("");

  const hasSearch = query.trim().length > 0;

  const filteredDreams = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];

    return dreams.filter((dream) => {
      const searchable = [
        dream.title,
        dream.category,
        dream.numbers,
        dream.ending,
        dream.house,
        ...(dream.keywords || []),
      ]
        .filter(Boolean)
        .join(" ");

      return normalize(searchable).includes(q);
    });
  }, [query]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <section className="border-b border-green-100 bg-white/90">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <nav className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <Link
              href="/bn"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <span aria-hidden="true">←</span>
              হোম
            </Link>

            <Link
              href="/dream-number"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              English
            </Link>
          </nav>

          <div className="pt-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              তীর স্বপ্নের নম্বর
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              আপনি কী স্বপ্ন দেখেছেন?
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
              আপনার স্বপ্ন অনুসন্ধান করে ঐতিহ্যবাহী স্বপ্নের নম্বরের সঙ্গে মিল খুঁজে নিন।
            </p>
          </div>

          <div className="mt-8">
            <label htmlFor="dream-search" className="sr-only">
              আপনার স্বপ্ন অনুসন্ধান করুন
            </label>

            <input
              id="dream-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="যেমন: snake, money, rain, dog, marriage..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {!hasSearch ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="text-4xl">🔎</div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              আপনার স্বপ্ন অনুসন্ধান করুন
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              উপরের ঘরে স্বপ্ন, প্রাণী, বস্তু, ব্যক্তি, ঘটনা বা কোনো শব্দ লিখুন।
              যেমন: <strong>snake</strong>, <strong>rain</strong>,{" "}
              <strong>money</strong>, <strong>dog</strong> অথবা{" "}
              <strong>school</strong>।
            </p>
          </div>
        ) : filteredDreams.length === 0 ? (
          <div className="rounded-2xl border border-green-100 bg-white/90 px-6 py-12 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              কোনো মিল পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              অন্য কোনো শব্দ বা বাক্যাংশ দিয়ে চেষ্টা করুন।
            </p>

            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              অনুসন্ধান মুছে দিন
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 text-sm text-slate-500">
              মোট{" "}
              <span className="font-semibold text-slate-900">
                {filteredDreams.length}
              </span>{" "}
              টি মিল পাওয়া গেছে।
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredDreams.map((dream, index) => (
                <article
                  key={`${dream.slug}-${index}`}
                  className="rounded-2xl border border-green-100 bg-white/90 p-5 shadow-sm"
                >
                  <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {dream.category}
                  </span>

                  <h2 className="mt-4 text-base font-semibold leading-6 text-slate-900">
                    {dream.title}
                  </h2>

                  {dream.numbers && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        স্বপ্নের নম্বর
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {dream.numbers.split(",").map((number) => (
                          <span
                            key={number.trim()}
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-bold text-white"
                          >
                            {number.trim().padStart(2, "0")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {dream.ending && (
                    <p className="mt-4 text-sm text-slate-600">
                      <span className="font-semibold">শেষ সংখ্যা:</span>{" "}
                      {dream.ending}
                    </p>
                  )}

                  {dream.house && (
                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-semibold">ঘর:</span>{" "}
                      {dream.house}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="border-t border-green-100 bg-white/90">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center text-sm leading-6 text-slate-500 sm:px-6">
          এখানে দেখানো স্বপ্নের নম্বরের সম্পর্কগুলো ঐতিহ্যবাহী, সম্প্রদায়ভিত্তিক
          এবং সম্পাদকীয় তথ্যের ওপর ভিত্তি করে। এগুলো বৈজ্ঞানিকভাবে প্রমাণিত
          ভবিষ্যদ্বাণী বা তীর ফলাফলের নিশ্চয়তা নয়।
        </div>
      </section>
    </main>
  );
}
