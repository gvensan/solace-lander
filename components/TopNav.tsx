"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { LoginModal } from "./LoginModal";
import { trackEvent } from "@/lib/analytics";
import { Radio, ChevronDown, LogOut, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#topics", label: "Learning Pillars" },
  { href: "/#events", label: "Workshops & Webinars" },
  { href: "/#library", label: "Library" },
  { href: "/#training", label: "Training" },
  { href: "/#community", label: "Community" },
];

export function TopNav() {
  const { user, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="bg-solace-blue sticky top-0 z-40 border-b border-white/10">
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          {/* Logo / wordmark */}
          <Link href="/" className="flex items-center gap-2 text-white" onClick={() => setMobileOpen(false)}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-solace-green">
              <Radio size={18} className="text-dark-blue" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Solace <span className="text-bright-green">Lander</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden flex-1 items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-white/80 transition hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-bright-green transition hover:brightness-110"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <a
              href="https://console.solace.cloud/login/new-account"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("try_it_free_click", { location: "nav" })}
              className="hidden rounded-full bg-solace-green px-4 py-2 text-sm font-semibold text-dark-blue transition hover:brightness-105 sm:inline-block"
            >
              Try It Free
            </a>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-bright-green text-xs font-bold text-dark-blue">
                    {user.name.charAt(0)}
                  </span>
                  <span className="hidden sm:inline">My Account</span>
                  <ChevronDown size={14} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-cool-13 bg-white p-2 shadow-xl">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-deep-blue">{user.name}</p>
                      <p className="mono-label text-deep-blue/60">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-deep-blue hover:bg-cool-12"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Login
              </button>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="grid h-9 w-9 place-items-center rounded-lg text-white hover:bg-white/10 md:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-dark-blue md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <div className="flex flex-col">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-white/85 transition hover:bg-white/10 hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 font-semibold text-bright-green transition hover:bg-white/10"
                  >
                    Admin
                  </Link>
                )}
                <a
                  href="https://console.solace.cloud/login/new-account"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 rounded-full bg-solace-green px-4 py-3 text-center text-sm font-semibold text-dark-blue transition hover:brightness-105"
                >
                  Try It Free
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
