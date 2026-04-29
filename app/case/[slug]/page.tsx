import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import FooterLinks from "@/app/components/FooterLinks";
import FooterStackLink from "@/app/components/FooterStackLink";
import { getCase, cases } from "@/lib/cases";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCase(slug);
  if (!cs) return {};
  const description = cs.lede.length > 200 ? `${cs.lede.slice(0, 197)}…` : cs.lede;
  return {
    title: cs.headline,
    description,
    openGraph: {
      title: cs.headline,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: cs.headline,
      description,
    },
    alternates: { canonical: `https://nateholt.com/case/${cs.slug}` },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCase(slug);
  if (!cs) notFound();

  return (
    <>
      <Nav />

      <div className="bg-primary">
        <div className="ch-crumbs">
          <div className="ch-crumb-trail">
            <Link href="/#work">Case studies</Link>
            <span className="ch-sep">/</span>
            <span className="ch-crumb-current">{cs.company}</span>
          </div>
        </div>

        <section className="ch-hero">
          <h1 className="ch-headline">{cs.headline}</h1>

          {cs.cta && (
            <div className="ch-cta">
              <Link className="ch-cta-btn" href={cs.cta.href}>{cs.cta.label}</Link>
            </div>
          )}

          <div className="ch-stats">
            <dl className="ch-meta">
              <div className="ch-meta-row">
                <dt>Company:</dt>
                <dd>{cs.company}</dd>
              </div>
              <div className="ch-meta-row">
                <dt>Years:</dt>
                <dd>{cs.year}</dd>
              </div>
              <div className="ch-meta-row">
                <dt>Role:</dt>
                <dd>{cs.role}</dd>
              </div>
              {cs.stack && (
                <div className="ch-meta-row">
                  <dt>Stack:</dt>
                  <dd>{cs.stack}</dd>
                </div>
              )}
            </dl>

            {cs.metrics.map((m, i) => (
              <div key={i} className="ch-metric">
                <div className="ch-metric-h">{m.headline}</div>
                <div className="ch-metric-c">{m.caption}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-tertiary">
        <div className="ch-body">
          <section className="ch-section">
            <p className="ch-lede">
              {cs.companyUrl ? (
                <>
                  <a href={cs.companyUrl} target="_blank" rel="noopener noreferrer">{cs.company}</a>
                  {" "}
                  {cs.lede.replace(cs.company, "").replace(/^[\s,]+/, "")}
                </>
              ) : (
                cs.lede
              )}
            </p>
          </section>

          <section className="ch-section">
            <div className="ch-eyebrow">The Challenge</div>
            <h2 className="ch-h2">{cs.challengeTitle}</h2>
            {cs.challenge.map((p, i) => <p key={i}>{p}</p>)}
          </section>

          {cs.quote && (
            <aside className="ch-quote">
              <blockquote>{cs.quote.text}</blockquote>
              <div className="ch-quote-attr">
                <span className="ch-quote-name">{cs.quote.name}</span>
                {cs.quote.role && <span className="ch-quote-role">{cs.quote.role}</span>}
              </div>
            </aside>
          )}

          <section className="ch-section">
            <div className="ch-eyebrow">The solution</div>
            <h2 className="ch-h2">{cs.solutionTitle}</h2>
            <p>{cs.solutionIntro}</p>

            <ol className="ch-decisions">
              {cs.decisions.map((d, i) => (
                <li key={i}>
                  <div className="ch-decision-num">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 className="ch-decision-h">{d.heading}</h3>
                    <p>{d.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="ch-section">
            <div className="ch-eyebrow">The outcome</div>
            <h2 className="ch-h2">{cs.outcomeTitle}</h2>
            {cs.outcome.map((p, i) => <p key={i}>{p}</p>)}
          </section>

          <section className="ch-section ch-reflection">
            <div className="ch-eyebrow">One thing I&apos;d do differently</div>
            <p>{cs.reflection}</p>
          </section>
        </div>
      </div>

      {cs.related && cs.related.length > 0 && (
        <div className="bg-primary ch-related-wrap">
          <section className="ch-related">
            <div className="ch-eyebrow">Related</div>
            <div className="ch-related-grid">
              {cs.related.map((r, i) =>
                r.placeholder ? (
                  <div key={i} className="ch-card ch-card--placeholder" aria-disabled="true">
                    <div className="ch-card-tag">{r.tag}</div>
                    <div className="ch-card-title">{r.title}</div>
                    <div className="ch-card-meta">{r.meta}</div>
                    <div className="ch-card-foot">{r.foot}</div>
                  </div>
                ) : (
                  <Link key={i} className="ch-card" href={r.href}>
                    <div className="ch-card-tag">{r.tag}</div>
                    <div className="ch-card-title">{r.title}</div>
                    <div className="ch-card-meta">{r.meta}</div>
                    <div className="ch-card-foot">{r.foot}</div>
                  </Link>
                )
              )}
            </div>
          </section>
        </div>
      )}

      <div className="bg-primary">
        <footer>
          <div className="footwrap">
            <div className="f-brand">
              <Link className="brand" href="/">Nathan Holt</Link>
              <div className="b2">Product Lead based in New York. Currently shipping PowSignal.</div>
              <Link className="f-avail" href="/#about">Open to senior roles</Link>
              <FooterLinks />
            </div>
            <div className="fcol">
              <h5>Work</h5>
              <ul>
                <li><Link href="/#work">All roles</Link></li>
                <li><Link href="/#work">Thriving Center</Link></li>
                <li><Link href="/#work">Thorsun</Link></li>
                <li><Link href="/#work">Barneys</Link></li>
                <li><Link href="/#work">Dosable</Link></li>
              </ul>
            </div>
            <div className="fcol">
              <h5>Building</h5>
              <ul>
                <li><Link href="/#building">PowSignal</Link></li>
                <li><Link href="/#building">Side projects</Link></li>
              </ul>
            </div>
            <div className="fcol">
              <h5>Thinking</h5>
              <ul>
                <li><FooterStackLink /></li>
                <li><a href="https://linkedin.com/in/nateholt" target="_blank" rel="noopener noreferrer">Opinions</a></li>
              </ul>
            </div>
            <div className="fcol">
              <h5>Elsewhere</h5>
              <ul>
                <li><a href="https://linkedin.com/in/nateholt" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="mailto:nathanholt925@gmail.com?subject=Reaching%20out%20from%20your%20site">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="footend">
            <span>© 2026 Nathan Holt</span>
            <span>Based in New York</span>
            <span className="icons">◐ ◑ ◉ ◎</span>
          </div>
        </footer>
      </div>
    </>
  );
}
