import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <TopNav />
      <main className="bg-solace-blue flex flex-1 items-center justify-center px-4 text-center text-white">
        <div className="py-32">
          <p className="overline text-eyebrow">404</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">We Couldn&apos;t Find That Workshop</h1>
          <p className="mx-auto mt-4 max-w-md text-white/80">
            The page may have moved or the workshop slug is wrong. Head back to the catalog to find
            what you&apos;re looking for.
          </p>
          <Link
            href="/#catalog"
            className="mt-8 inline-block rounded-full bg-solace-green px-6 py-3 font-semibold text-dark-blue transition hover:brightness-105"
          >
            Browse workshops
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
