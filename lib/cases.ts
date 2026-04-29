export type Decision = {
  heading: string;
  body: string;
};

export type Metric = {
  headline: string;
  caption: string;
};

export type Quote = {
  text: string;
  name: string;
  role?: string;
};

export type RelatedCard = {
  href: string;
  tag: string;
  title: string;
  meta: string;
  foot: string;
  placeholder?: boolean;
};

export type CaseStudy = {
  slug: string;
  company: string;
  companyUrl?: string;
  year: string;
  role: string;
  stack?: string;
  headline: string;
  cta?: { label: string; href: string };
  metrics: [Metric, Metric];
  lede: string;
  challengeTitle: string;
  challenge: string[];
  quote?: Quote;
  solutionTitle: string;
  solutionIntro: string;
  decisions: Decision[];
  outcomeTitle: string;
  outcome: string[];
  reflection: string;
  related?: RelatedCard[];
};

export const cases: CaseStudy[] = [
  {
    slug: "onboarding",
    company: "Thriving Center of Psychology",
    companyUrl: "https://thrivingcenterofpsych.com",
    year: "2023 – 2025",
    role: "Head of Product",
    stack: "Tellescope · Segment · dbt",
    headline:
      "How a five-step intake handoff became a single, observable funnel",
    cta: { label: "Ask Nathan", href: "/#about" },
    metrics: [
      {
        headline: "25% faster time-to-first-session",
        caption: "from a 7-day wait to under 5, with the same team",
      },
      {
        headline: "30% more intake volume, same team",
        caption: "capacity freed by routing simple cases past the specialist queue",
      },
    ],
    lede:
      "Thriving Center of Psychology is a multi-state mental health practice serving thousands of patients a year. By 2023, intake had grown from a side responsibility into a structural bottleneck — and a primary reason patients dropped off before their first session.",
    challengeTitle: "A five-step handoff that no one could see end-to-end",
    challenge: [
      "When I joined as Head of Product, intake was passing through three insurance verifiers, two intake coordinators, and a clinical matcher — with no system of record connecting them. A patient who submitted a form on Monday might not hear back until Thursday. Drop-off was high. Nobody had a clear view of where patients were getting stuck.",
      "The team's assumption was that the bottleneck was therapist capacity. The assumption turned out to be wrong.",
    ],
    quote: {
      text: "Everyone had a different theory about why intake was slow. Nobody had the data to prove any of them.",
      name: "Nathan Holt",
      role: "on his first week",
    },
    solutionTitle: "Map the workflow first. Then automate the chokepoint, not the tool.",
    solutionIntro:
      "Two weeks of shadowing the intake team revealed the actual bottleneck: insurance pre-verification, handled manually by a single specialist. Everything downstream — therapist matching, scheduling, onboarding — was waiting on her queue.",
    decisions: [
      {
        heading: "Map the actual workflow before touching any tools.",
        body: "Two weeks shadowing intake coordinators, logging every handoff. The bottleneck wasn't what anyone thought — and the data made the conversation about what to fix actually possible.",
      },
      {
        heading: "Triage in the existing CRM, not a new tool.",
        body: "Rather than introduce new software the ops team would resist, we extended Tellescope to auto-triage by insurance type. Simple cases routed straight to therapist matching. Complex cases queued for the specialist. Her workload dropped 60% in weeks.",
      },
      {
        heading: "Async status updates so patients stopped calling.",
        body: "A surprising chunk of coordinator time was spent answering “where are we in the process?” calls. Automated status emails at each stage cut call volume 40% in the first month — capacity we didn't know we had.",
      },
    ],
    outcomeTitle: "From a 7-day wait to under 5, with the same team",
    outcome: [
      "Time-to-first-session dropped 25%. Coordinator capacity freed up enough that we handled 30% more intake volume without hiring. Patient satisfaction on the intake experience moved from 3.4 to 4.1.",
    ],
    reflection:
      "I should have mapped the workflow before my first week was over, not two weeks in. I assumed the team's mental model of the bottleneck was accurate. It wasn't. The two weeks I spent designing solutions to the wrong problem cost a month of momentum.",
    related: [
      {
        href: "/case/payroll",
        tag: "Placeholder",
        title: "Automating contractor payroll",
        meta: "$100K/yr saved through Rippling integration",
        foot: "Thriving Center · 2024",
        placeholder: true,
      },
      {
        href: "/case/data-warehouse",
        tag: "Placeholder",
        title: "A unified data warehouse",
        meta: "Clinical, ops, and marketing in one source of truth",
        foot: "Thriving Center · 2024",
        placeholder: true,
      },
    ],
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}
