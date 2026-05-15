type Props = {
  color: string;
  intensity?: number;
  className?: string;
};

export function BrandGlow({ color, intensity = 0.55, className = "" }: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background: `radial-gradient(60% 55% at 50% 55%, ${color}${alphaHex(intensity)} 0%, transparent 70%)`,
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
