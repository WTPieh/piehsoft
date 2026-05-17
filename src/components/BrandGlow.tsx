type Props = {
  color: string;
  intensity?: number;
  className?: string;
};

export function BrandGlow({ color, intensity = 0.55, className = "" }: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -inset-10 sm:-inset-16 ${className}`}
      style={{
        // Contained soft bloom: both radials fade to FULLY transparent well
        // inside this (negatively-inset) element, so its rectangular bounds
        // are never visible — the glow blurs out organically, no clipped
        // edge. Pure CSS, painted once, no perf cost.
        background: `
          radial-gradient(52% 52% at 50% 52%, ${color}${alphaHex(intensity)} 0%, ${color}${alphaHex(intensity * 0.42)} 40%, transparent 70%),
          radial-gradient(70% 66% at 50% 58%, ${color}${alphaHex(intensity * 0.2)} 0%, transparent 58%)
        `,
      }}
    />
  );
}

function alphaHex(a: number): string {
  const clamped = Math.max(0, Math.min(1, a));
  const byte = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");
  return byte;
}
