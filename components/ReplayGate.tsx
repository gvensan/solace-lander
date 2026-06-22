"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import type { Workshop } from "@/lib/types";
import { LoginModal } from "./LoginModal";
import { Lock, FileText, FolderGit2, PlayCircle } from "lucide-react";

export function ReplayGate({ workshop }: { workshop: Workshop }) {
  const { user, hasAttended } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const unlocked = hasAttended(workshop.attendees);

  // Teaser shown above the gate so value is visible before the login ask.
  const teaser = (
    <ul className="mt-4 space-y-1.5 text-sm text-white/80">
      <li>• Full session recording</li>
      <li>• Slide deck download</li>
      <li>• Code repository</li>
    </ul>
  );

  if (unlocked) {
    return (
      <div>
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-cool-13 bg-dark-blue">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${workshop.videoId}`}
            title={`${workshop.title} replay`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {workshop.slidesUrl && (
            <a
              href={workshop.slidesUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cool-13 px-4 py-2 text-sm font-medium text-deep-blue transition hover:border-classic-green"
            >
              <FileText size={16} /> Download slides
            </a>
          )}
          {workshop.repoUrl && (
            <a
              href={workshop.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cool-13 px-4 py-2 text-sm font-medium text-deep-blue transition hover:border-classic-green"
            >
              <FolderGit2 size={16} /> Code repository
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-solace-blue p-8 text-white sm:p-12">
        {/* Blurred faux-player behind the gate */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <PlayCircle size={220} className="absolute -right-10 -top-10 text-white" />
        </div>
        <div className="relative max-w-lg">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10">
            <Lock size={22} className="text-bright-green" />
          </span>
          <h3 className="mt-4 text-2xl text-white">Workshop Replay Is Locked</h3>
          {user ? (
            <p className="mt-2 text-white/80">
              You&apos;re signed in as <strong>{user.email}</strong>, but that SolaceID isn&apos;t on
              this workshop&apos;s attendee list. The rest of this page is open to explore.
            </p>
          ) : (
            <p className="mt-2 text-white/80">
              The replay is available to attendees. Log in with your SolaceID to unlock it — the rest
              of this page is open to everyone.
            </p>
          )}
          {teaser}
          {!user && (
            <button
              onClick={() => setLoginOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-solace-green px-5 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105"
            >
              <Lock size={16} /> Log in to unlock replay
            </button>
          )}
        </div>
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
