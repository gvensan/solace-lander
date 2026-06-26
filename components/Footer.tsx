// Footer modeled on events.solace.com — 3 link columns, wordmark, action buttons, socials.

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Products",
    links: [
      { label: "Solace Platform", href: "https://solace.com/products/platform/" },
      { label: "Event Broker", href: "https://solace.com/products/event-broker/" },
      { label: "Event Portal", href: "https://solace.com/products/event-portal/" },
      { label: "Mission Control", href: "https://solace.com/products/event-broker/broker-management/#Mission_Control" },
      { label: "Insights", href: "https://solace.com/products/event-broker/cloud/insights/" },
      { label: "APIs and Protocols", href: "https://solace.com/products/event-broker/apis-protocols-micro-integrations/" },
      { label: "Integration Hub", href: "https://solace.com/integration-hub/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "https://solace.com/careers/" },
      { label: "Leadership", href: "https://solace.com/company/leadership/" },
      { label: "Customers", href: "https://solace.com/customers/" },
      { label: "Partners", href: "https://solace.com/partners/" },
      { label: "Events", href: "https://events.solace.com/" },
      { label: "Press Center", href: "https://solace.com/press/" },
      { label: "Privacy and Legal", href: "https://solace.com/legal/" },
      { label: "Trust, Compliance & Security Center", href: "https://solace.com/products/security/" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Docs", href: "https://docs.solace.com/" },
      { label: "API Tutorials", href: "https://tutorials.solace.dev/" },
      { label: "Dev Portal", href: "https://solace.dev/" },
      { label: "Codelabs", href: "https://codelabs.solace.dev/" },
      { label: "Free Courses", href: "https://training.solace.com/learn" },
      { label: "Blog", href: "https://solace.com/blog/" },
      { label: "Community", href: "https://community.solace.com/" },
    ],
  },
];

const BUTTONS = [
  { label: "Support", href: "https://solace.com/support/" },
  { label: "Contact", href: "https://solace.com/contact/" },
  { label: "Login", href: "https://console.solace.cloud/login/" },
];

// Brand glyph SVG paths (simple-icons) — lucide dropped social brand icons.
const SOCIALS: { label: string; href: string; path: string }[] = [
  { label: "Facebook", href: "https://www.facebook.com/solacedotcom/", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/solacedotcom/", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { label: "X", href: "https://twitter.com/solacedotcom", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { label: "YouTube", href: "https://www.youtube.com/@SolaceDotCom", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { label: "Instagram", href: "https://www.instagram.com/solacedotcom/", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { label: "GitHub", href: "https://github.com/SolaceLabs", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
  { label: "Medium", href: "https://medium.com/solace-engineering", path: "M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" },
];

export function Footer() {
  return (
    <footer className="bg-dark-blue text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Wordmark — official Solace 2025 logo (green wordmark; per brand: never recolor/redraw) */}
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/solace-logo-2025-green.png"
            alt="Solace"
            className="h-9 w-auto"
          />
        </div>

        {/* Link columns */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title} className="rounded-2xl bg-deep-blue/50 p-6">
              <p className="font-body text-lg font-semibold text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-white/75 transition hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {BUTTONS.map((b) => (
            <a
              key={b.label}
              href={b.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-classic-green px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-classic-green hover:text-dark-blue"
            >
              {b.label}
            </a>
          ))}
        </div>

        {/* Socials */}
        <div className="mt-8 flex justify-center gap-5">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="text-white/70 transition hover:text-bright-green">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>

        {/* Legal */}
        <p className="mt-10 text-center text-xs text-white/50">
          © 2026 Solace &nbsp;|&nbsp;{" "}
          <a href="https://solace.com/legal/" target="_blank" rel="noreferrer" className="hover:text-white">
            Privacy and Legal
          </a>{" "}
          &nbsp;|&nbsp;{" "}
          <a href="https://solace.com/sitemap/" target="_blank" rel="noreferrer" className="hover:text-white">
            Sitemap
          </a>
        </p>
      </div>
    </footer>
  );
}
