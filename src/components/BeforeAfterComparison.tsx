type Pair = {
  before: string;
  after: string;
  caption?: string;
};

type Props = {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeSubLabel?: string;
  afterSubLabel?: string;
  pairs?: Pair[];
};

export function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  beforeSubLabel,
  afterSubLabel,
  pairs,
}: Props) {
  const list: Pair[] =
    pairs && pairs.length > 0
      ? pairs
      : beforeImage && afterImage
        ? [{ before: beforeImage, after: afterImage }]
        : [];

  if (list.length === 0) return null;

  const multi = list.length > 1;
  // When there are multiple pairs the phones get tighter; a single pair gets the larger size.
  const phoneWidth = multi
    ? "min(260px, calc(52vh * 9 / 19.5))"
    : "min(360px, calc(72vh * 9 / 19.5))";

  return (
    <div className="flex flex-col items-center gap-y-10">
      {/* Column headers — shown once, span both columns */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end sm:justify-center gap-y-3 sm:gap-x-12 md:gap-x-20">
        <Header
          label={beforeLabel}
          subLabel={beforeSubLabel}
          align="left"
          width={phoneWidth}
        />
        <Header
          label={afterLabel}
          subLabel={afterSubLabel}
          align="right"
          width={phoneWidth}
        />
      </div>

      <div className={`flex flex-col ${multi ? "gap-y-16" : "gap-y-0"}`}>
        {list.map((p, i) => (
          <figure key={i} className="flex flex-col items-center">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-center gap-y-10 sm:gap-x-12 md:gap-x-20">
              <Phone
                src={p.before}
                alt={`Before — ${p.caption ?? "screen"}`}
                width={phoneWidth}
              />
              <Phone
                src={p.after}
                alt={`After — ${p.caption ?? "screen"}`}
                width={phoneWidth}
              />
            </div>
            {p.caption && (
              <figcaption className="font-mono-tag text-subtle text-center mt-6">
                {p.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

function Header({
  label,
  subLabel,
  align,
  width,
}: {
  label: string;
  subLabel?: string;
  align: "left" | "right";
  width: string;
}) {
  const headAlign =
    align === "right" ? "items-end text-right" : "items-start text-left";
  return (
    <div className={`flex flex-col ${headAlign}`} style={{ width }}>
      <span className="font-mono-tag text-subtle">{label}</span>
      {subLabel && (
        <span className="font-mono text-[11px] tracking-wider uppercase text-foreground/70 mt-1">
          {subLabel}
        </span>
      )}
    </div>
  );
}

function Phone({
  src,
  alt,
  width,
}: {
  src: string;
  alt: string;
  width: string;
}) {
  return (
    <div className="relative" style={{ width, aspectRatio: "9 / 19.5" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain"
      />
    </div>
  );
}
