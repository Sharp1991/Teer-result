"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { dreams } from "./dreams";



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
          <nav className="sticky top-0 z-10 -mx-4 border-b border-slate-800 bg-slate-950 px-4 py-3 shadow-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <Link href="/" className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Shillong
                </p>
                <p className="mt-0.5 text-sm font-black tracking-tight text-white">
                  TEER RESULTS
                </p>
              </Link>

              <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-inner">
                <Link href="/" className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
                  Results
                </Link>
                <Link href="/statistics" className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
                  Statistics
                </Link>
                <Link href="/history" className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
                  History
                </Link>
                <Link href="/dream-number" className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-950 shadow-sm">
                  Dream Number
                </Link>
              </div>
            </div>
          </nav>

          <div className="pt-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Teer Dream Number Finder
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What did you dream about?
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Enter a word or short description of what you saw in your dream.
For example: snake, elephant, rain, river, wedding, flying, or a dead person.

We’ll search for a traditional dream-number association that matches your description.
If no matching association is found, we’ll let you know instead of showing an unrelated number.
            </p>
          </div>

          <div className="mt-8">
            <label htmlFor="dream-search" className="sr-only">
              Search your dream
            </label>

            <input
              id="dream-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: snake, money, rain, dog, marriage..."
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
              Search your dream
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Enter a dream, animal, object, person, event or keyword above.
              For example: <strong>snake</strong>, <strong>rain</strong>,{" "}
              <strong>money</strong>, <strong>dog</strong> or{" "}
              <strong>school</strong>.
            </p>
          </div>
        ) : filteredDreams.length === 0 ? (
          <div className="rounded-2xl border border-green-100 bg-white/90 px-6 py-12 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              No matching dream found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try a different word or phrase.
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery("");
              }}
              className="mt-5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 text-sm text-slate-500">
              Found{" "}
              <span className="font-semibold text-slate-900">
                {filteredDreams.length}
              </span>{" "}
              matching dream
              {filteredDreams.length === 1 ? "" : "s"}.
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
                        Dream numbers
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
                      <span className="font-semibold">Ending:</span>{" "}
                      {dream.ending}
                    </p>
                  )}

                  {dream.house && (
                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-semibold">House:</span>{" "}
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
          Dream-number associations shown here are traditional, community and
          editorial references. They are not scientifically validated
          predictions or guarantees of Teer results.
        </div>
      </section>
    </main>
  );
}
