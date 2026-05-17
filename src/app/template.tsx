// A template (not a layout) so it remounts with a fresh key on every
// navigation — that re-triggers the .page-enter animation each time,
// giving a smooth transition between routes. Server Component: the
// animation is pure CSS, no client JS.
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter">{children}</div>;
}
