// Remounts on every navigation (unlike layout), so .page-enter runs
// each route change. Wraps ONLY the page content — the persistent
// shader lives in the layout (sibling of this), so it keeps rendering
// continuously through the navigation and never disappears.
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter">{children}</div>;
}
