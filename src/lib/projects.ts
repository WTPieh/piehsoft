export type Metric = { value: string; label: string };

export type CaseSection =
  | {
      kind: "prose";
      id: string;
      label?: string;
      heading: string;
      body: string;
    }
  | {
      kind: "receipts";
      id: string;
      label: string;
      heading: string;
      lede: string;
      findings: { item: string; severity?: "critical" | "high" | "note" }[];
      callout?: { title: string; body: string };
    }
  | {
      kind: "scoreboard";
      id: string;
      label: string;
      heading: string;
      lede?: string;
      stats: { value: string; label: string; sublabel?: string }[];
      footnote?: string;
    }
  | {
      kind: "code";
      id: string;
      label: string;
      heading: string;
      lede: string;
      code: string;
      language: string;
      caption: string;
      followUp?: string;
    }
  | {
      kind: "tokens";
      id: string;
      label: string;
      heading: string;
      lede: string;
      brand?: {
        logoSrc?: string;
        wordmarkSrc?: string;
        tagline?: string;
      };
      swatches: { color: string; name: string; value: string }[];
      counts: { value: string; label: string }[];
      footnote?: string;
    }
  | {
      kind: "stack";
      id: string;
      label: string;
      heading: string;
      lede: string;
      items: { name: string; role: string }[];
    }
  | {
      kind: "gallery";
      id: string;
      label: string;
      heading: string;
      lede?: string;
      images: { src: string; alt: string; caption?: string }[];
    }
  | {
      kind: "image-prose";
      id: string;
      label: string;
      heading: string;
      body: string;
      image: { src: string; alt: string; caption?: string };
      imageSide?: "left" | "right";
    }
  | {
      kind: "before-after";
      id: string;
      label: string;
      heading: string;
      lede?: string;
      beforeImage?: string;
      afterImage?: string;
      beforeSubLabel?: string;
      afterSubLabel?: string;
      pairs?: { before: string; after: string; caption?: string }[];
    }
  | {
      kind: "cta";
      id: string;
      label: string;
      heading: string;
      body: string;
    };

export type Project = {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  hero: { image: string; glow: string };
  metadata: {
    timeline: string;
    role: string;
    technology: string;
    platform: string;
  };
  oneLineFraming: string;
  metrics: Metric[];
  tech: string[];
  brand: { from: string; to: string };
  sections: CaseSection[];
};

export const projects: Project[] = [
  {
    id: "hornscore",
    title: "HornScore",
    tagline: "5,000 hunters, zero security debt",
    summary: "5,000+ users, security overhaul, modern iOS rebuild.",
    hero: {
      image: "/projects/hornscore/photos/hero.png",
      glow: "#d97a2c",
    },
    metadata: {
      timeline: "Sep 2024 → present  ·  Native rebuild Nov 2025",
      role: "Lead Engineer & Designer",
      technology: "Swift, SwiftUI, Firebase, Cloud Functions",
      platform: "iOS native",
    },
    oneLineFraming:
      "Inherited 60,000 lines of undocumented React Native and a security vulnerability exposing every user's photos. Fixed it in week one, shipped Phase 1 inside the legacy code, then led the full native iOS rebuild — 581 Swift files, 104K LOC, 303 SwiftUI views.",
    metrics: [
      { value: "5,000+", label: "Production users" },
      { value: "104K LOC", label: "Native Swift codebase" },
      { value: "15× zoom", label: "Coordinate-locked precision" },
    ],
    tech: ["Swift", "SwiftUI", "Firebase", "Cloud Functions"],
    brand: { from: "#3a2812", to: "#8a4d1f" },
    sections: [
      {
        kind: "before-after",
        id: "before-after",
        label: "The Redesign",
        heading: "Before and after.",
        lede: "Same product, two codebases — the legacy React Native build beside the native SwiftUI rewrite.",
        beforeSubLabel: "Legacy · React Native",
        afterSubLabel: "Native · SwiftUI",
        pairs: [
          {
            before:
              "https://media.williampieh.com/projects/hornscore/photos/old-profile.png",
            after:
              "https://media.williampieh.com/projects/hornscore/photos/modern-profile.png",
            caption: "User profile",
          },
          // Add additional pairs here — e.g. home feed, scoring tool, comments.
          // Example shape:
          // {
          //   before: "https://media.williampieh.com/projects/hornscore/photos/old-home.png",
          //   after:  "https://media.williampieh.com/projects/hornscore/photos/home-feed.png",
          //   caption: "Home feed",
          // },
        ],
      },
      {
        kind: "prose",
        id: "product",
        label: "The Product",
        heading: "The Product",
        body: "HornScore is a hunting app for serious hunters. Users photograph trail-cam footage, field-judge antler measurements using anatomical references, calculate official scores adapted from Boone & Crockett methodology, share scores with a community, and access species-specific guides.\n\nThe audience invests in premium equipment and expects the software to match. This is a production app with 5,000+ users.",
      },
      {
        kind: "gallery",
        id: "screens",
        label: "Screens",
        heading: "Eighty-seven screens, one design system.",
        lede: "Every flow in the production app — scoring, filters, settings, social, guides, messaging, comments, albums, reports — built from a single tokenized system. A representative selection is shown below.",
        images: [
          {
            src: "/projects/hornscore/photos/home-feed.png",
            alt: "Home feed",
            caption: "Home feed",
          },
          {
            src: "/projects/hornscore/photos/score-detail.png",
            alt: "Score detail",
            caption: "Score detail",
          },
          {
            src: "/projects/hornscore/photos/community.png",
            alt: "Community",
            caption: "Community",
          },
          {
            src: "/projects/hornscore/photos/comments.png",
            alt: "Comments",
            caption: "Comments",
          },
          {
            src: "/projects/hornscore/photos/profile-personal.png",
            alt: "Profile",
            caption: "Profile",
          },
          {
            src: "/projects/hornscore/photos/species-selector.png",
            alt: "Species selector",
            caption: "Species selector",
          },
          {
            src: "/projects/hornscore/photos/scoring-mode.png",
            alt: "Scoring mode",
            caption: "Scoring mode",
          },
          {
            src: "/projects/hornscore/photos/field-judge-modal.png",
            alt: "Field judge modal",
            caption: "Field judge modal",
          },
          {
            src: "/projects/hornscore/photos/field-judge-measurement.png",
            alt: "Line Reference Tool — Bézier measurement",
            caption: "Measurement tool",
          },
        ],
      },
      {
        kind: "receipts",
        id: "inherited",
        label: "What I Inherited",
        heading: "Week one: audit findings.",
        lede: "Before writing a single feature, I documented what was actually in the repository. Here's the report I wrote to the founders.",
        findings: [
          { item: "50,000–60,000 lines of React Native", severity: "note" },
          { item: "Three partially implemented versions of the app, in parallel" },
          { item: "No versioning. No tests. No documentation." },
          { item: "Individual files averaged 2,000–5,000 lines each" },
          {
            item: "Firebase storage bucket was publicly readable",
            severity: "critical",
          },
        ],
        callout: {
          title: "The security finding",
          body: "Every user's trail-cam photos, hunting locations, and personal images were accessible to anyone with the URL. I documented the exposure, implemented proper Firestore rules, and verified the fix before touching anything else.",
        },
      },
      {
        kind: "image-prose",
        id: "phase-1",
        label: "Phase 1",
        heading: "Phase 1 — ship inside what already exists.",
        body: "Before proposing a rebuild, I shipped the Line Reference Tool inside the legacy React Native codebase. The goal was simple: prove that complex new functionality could be delivered in the existing code, on time, without breaking anything.\n\nIt was the work that earned the trust to propose the bigger move.",
        image: {
          src: "/projects/hornscore/photos/field-judge-modal.png",
          alt: "Line Reference Tool",
          caption: "Line Reference Tool, shipped inside the legacy code.",
        },
        imageSide: "right",
      },
      {
        kind: "scoreboard",
        id: "phase-2",
        label: "Phase 2",
        heading: "Phase 2 — the native rebuild.",
        lede: "First commit on the rebuild branch: November 6, 2025. Native Swift, SwiftUI, MVVM + Coordinator architecture, dependency-injection container, repository pattern, design system built to scale. Owned by one person.",
        stats: [
          { value: "581", label: "Swift files", sublabel: "across the repo" },
          { value: "104K", label: "Lines of Swift", sublabel: "production code" },
          { value: "303", label: "SwiftUI views", sublabel: "156 feature-specific" },
          { value: "39", label: "Domain entities", sublabel: "modeled and validated" },
          { value: "87", label: "User-facing screens", sublabel: "across 12 feature modules" },
          { value: "5", label: "Backend integrations", sublabel: "Firebase, RC, Amplitude, Sentry, FB" },
        ],
        footnote:
          "Risk assessment from the shareholder progress report: technical risk LOW. The remaining work is feature implementation, not re-architecture.",
      },
      {
        kind: "code",
        id: "math",
        label: "The Math",
        heading: "The math underneath the measurement tool.",
        lede: "The Line Reference Tool lets users place Bézier curve points on a photo and trace anatomical landmarks at up to 15× zoom — with coordinate-locked precision, even as the user pans, zooms, and re-zooms.\n\nThe trick is two bidirectional transforms between canvas space (image pixels) and screen space (the rendered SwiftUI view). Every touch event, every drawn point, every hit-test runs through these:",
        code: `func screenToCanvas(_ screenPoint: CGPoint, viewSize: CGSize,
                    totalScale: CGFloat, totalOffset: CGSize) -> CGPoint {
    let center = CGPoint(x: viewSize.width / 2, y: viewSize.height / 2)
    return CGPoint(
        x: (screenPoint.x - center.x - totalOffset.width) / totalScale + center.x,
        y: (screenPoint.y - center.y - totalOffset.height) / totalScale + center.y
    )
}`,
        language: "swift",
        caption:
          "FieldJudgeScoringViewModel.swift — the coordinate-space math core (2,089 lines).",
        followUp:
          "The Bézier rendering uses a Catmull-Rom spline with arc-length computed by parametric subdivision (200 intervals per segment), integrated in real time as the user adjusts points. Hit-testing dynamically adjusts a 44pt tap threshold to screen space, and stroke width scales inversely with zoom so lines stay visible without thickening.",
      },
      {
        kind: "prose",
        id: "unified",
        label: "The Unified Tool",
        heading: "Two tools became one.",
        body: "The legacy app had separate straight-line and curved-line measurement modes — two interaction models the user had to keep in their head.\n\nThe rebuild collapses both into a single canvas state machine. The first two points calibrate against an anatomical reference; three or more extend into a curved measurement. The transition is automatic; users never see a mode toggle.\n\nThe code is just as direct: a seven-state enum, an auto-advancing transition function, and comments throughout marked `// Legacy — should not be entered in unified flow`.",
      },
      {
        kind: "tokens",
        id: "design-system",
        label: "Design System",
        heading: "A 586-line design system, before a single feature shipped.",
        lede: "I built the tokens first. Adaptive light/dark, semantic surfaces, a brand color that adjusts to color scheme, spring curves that match native iOS sheet snap. Every screen in the app draws from this file.",
        brand: {
          logoSrc: "/brand/hornscore-logo.svg",
          wordmarkSrc: "/brand/hornscore-text.svg",
          tagline: "Score trophies the right way. Built by hunters, for hunters.",
        },
        swatches: [
          { color: "#be8454", name: "Brand primary", value: "RGB(0.745, 0.518, 0.365)" },
          { color: "#065767", name: "Brand accent · Light", value: "#065767" },
          { color: "#1e92a8", name: "Brand accent · Dark", value: "#1E92A8" },
          { color: "#1a1a1a", name: "Surface · Dark", value: "Adaptive" },
        ],
        counts: [
          { value: "50+", label: "Color tokens" },
          { value: "25", label: "Spacing tokens" },
          { value: "20+", label: "Type sizes" },
          { value: "40+", label: "Frame sizes" },
        ],
        footnote:
          "DesignSystem.swift — 586 lines, dark-mode-aware throughout, used across 165 production files.",
      },
      {
        kind: "stack",
        id: "stack",
        label: "The Stack",
        heading: "Production infrastructure, wired before the UI.",
        lede: "Auth, analytics, crash reporting, subscriptions — all integrated and verified before a single feature screen was built. Standard practice in mature engineering organizations; rare in solo work.",
        items: [
          { name: "Firebase", role: "Auth, Firestore, Storage" },
          { name: "Cloud Functions", role: "TypeScript · FCM, provisioning" },
          { name: "RevenueCat", role: "Subscription billing" },
          { name: "Amplitude", role: "Product analytics" },
          { name: "Sentry", role: "Crash & error reporting" },
          { name: "Sign in with Apple", role: "Nonce-based OAuth" },
          { name: "Google", role: "OAuth · auto-login" },
          { name: "Facebook", role: "OAuth · email verification" },
        ],
      },
      {
        kind: "cta",
        id: "applies-to-you",
        label: "Why this matters",
        heading: "Same problem, different vertical.",
        body: "If your business runs on an iPhone app that captures field data and syncs to a server, this is the same problem shape. The track record I'd bring: audit your codebase for security and architecture risk in week one, ship value inside the existing code while we plan, and only propose a rebuild when the data — not the engineer — calls for it.",
      },
    ],
  },
  {
    id: "halo-plus",
    title: "Halo+",
    tagline: "3,500 students in 3 weeks",
    summary: "Consumer iOS app, App Store launch, 55.6% conversion.",
    hero: {
      image: "/projects/halo-plus/photos/hero.png",
      glow: "#7c5cff",
    },
    metadata: {
      timeline: "2024",
      role: "Solo founder, design + engineering",
      technology: "Swift, SwiftUI, App Store Connect",
      platform: "iOS native · App Store",
    },
    oneLineFraming:
      "Designed, built, and launched a consumer iOS app on the App Store solo — 3,500 students onboarded in three weeks, 55.6% App Store conversion, 698 DAU at peak.",
    metrics: [
      { value: "3,570", label: "Total downloads" },
      { value: "698", label: "Peak DAU" },
      { value: "55.6%", label: "App Store conversion" },
    ],
    tech: ["Swift", "SwiftUI", "App Store Connect", "Analytics"],
    brand: { from: "#1f1a3a", to: "#4a3aa3" },
    sections: [
      {
        kind: "prose",
        id: "product",
        label: "The Product",
        heading: "The Product",
        body: "Halo+ was a consumer iOS app shipped solo from concept to App Store in months. Design system, codebase, App Store materials, analytics, and growth experiments — all under one consistent direction.",
      },
      {
        kind: "prose",
        id: "proves",
        label: "What this proves",
        heading: "What this proves",
        body: "55.6% App Store conversion is not a beginner number. It comes from understanding both the screenshot funnel and the first-launch experience as one system. 3,500 students in three weeks is the proof that the experience held up once they got in.",
      },
    ],
  },
  {
    id: "lead-generation-pipeline",
    title: "Lead Generation Pipeline",
    tagline: "$100K+ annually, zero human intervention",
    summary: "Production data pipeline that replaced manual prospecting.",
    hero: {
      image: "/projects/lead-generation-pipeline/photos/hero.png",
      glow: "#3d8a5a",
    },
    metadata: {
      timeline: "2025",
      role: "Architect & engineer",
      technology: "Python, Postgres, queue workers, LLM enrichment",
      platform: "Backend pipeline, multi-source data",
    },
    oneLineFraming:
      "An outbound system that ingests prospect signals, enriches them, and produces a vetted queue — replacing manual prospecting and generating $100K+ in annual qualified pipeline with zero human intervention.",
    metrics: [
      { value: "$100K+", label: "Annual pipeline" },
      { value: "0", label: "Manual touches" },
      { value: "Daily", label: "Refresh cadence" },
    ],
    tech: ["Python", "Postgres", "Queue workers", "LLM enrichment"],
    brand: { from: "#102a1d", to: "#2e6a45" },
    sections: [
      {
        kind: "prose",
        id: "product",
        label: "The Product",
        heading: "The Product",
        body: "Most outbound teams run on a stack of spreadsheets and tribal knowledge. This pipeline replaces the human bottleneck with a deterministic system — every record traceable, every step observable, every output measurable against revenue.",
      },
      {
        kind: "prose",
        id: "architecture",
        label: "Architecture",
        heading: "Architecture",
        body: "Idempotent queue workers, audited record trail per prospect, and LLMs that enrich and rank but never make the final go/no-go decision. The pipeline keeps running cleanly when a model goes down.",
      },
    ],
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
