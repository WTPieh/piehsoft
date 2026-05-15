export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="font-display text-2xl leading-none">PiehSoft</p>
          <p className="font-mono-tag text-muted mt-3">
            Design &amp; AI engineering · Phoenix, AZ
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-1.5 text-sm">
          <a
            href="mailto:william@piehsoft.com"
            className="hover:text-muted transition-colors"
          >
            william@piehsoft.com
          </a>
          <a
            href="tel:+19289634919"
            className="hover:text-muted transition-colors text-muted"
          >
            (928) 963-4919
          </a>
          <p className="font-mono-tag text-subtle mt-1">
            &copy; {new Date().getFullYear()} PiehSoft · William Pieh
          </p>
        </div>
      </div>
    </footer>
  );
}
