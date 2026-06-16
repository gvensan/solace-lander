// Pure presentational heading — safe to import from client or server components.
export function SectionHeading({
  overline,
  title,
  subtitle,
}: {
  overline: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <p className="overline text-classic-green">{overline}</p>
      <h2 className="mt-1 text-3xl text-deep-blue">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-deep-blue/70">{subtitle}</p>}
    </div>
  );
}
