// Shown via Suspense (loading.tsx) while a route's data/segment loads.
// Minimal, brand-consistent: a thin spinning arc centered in the
// content area, with an accessible status label.
export function RouteLoading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="min-h-[70vh] flex items-center justify-center"
    >
      <div className="route-loader" />
    </div>
  );
}
