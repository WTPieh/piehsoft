export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="font-display text-2xl leading-none">PiehSoft</p>
          <span className="hidden md:inline font-display italic text-lg text-muted whitespace-nowrap">
            Considered software.
          </span>
          <p className="font-mono-tag text-muted mt-2">
            Design &amp; AI engineering · Phoenix, AZ
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-1 text-sm">
          <a
            href="tel:+19289634919"
            className="hover:text-muted transition-colors text-muted leading-none"
          >
            (928) 963-4919
          </a>
          <a
            href="mailto:william@piehsoft.com"
            className="hover:text-muted transition-colors"
          >
            william@piehsoft.com
          </a>
          <p className="font-mono-tag text-subtle mt-2">
            &copy; {new Date().getFullYear()} PiehSoft, LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
