import Image from "next/image";
import Nav from "./components/Nav";
import HeroChat from "./components/HeroChat";
import HeroMark from "./components/HeroMark";
import StackPanel from "./components/StackPanel";
import UseSection from "./components/UseSection";
import PresetGrid from "./components/PresetGrid";
import AboutChips from "./components/AboutChips";
import AboutActions from "./components/AboutActions";
import KeepGoButton from "./components/KeepGoButton";
import FooterStackLink from "./components/FooterStackLink";
import PowSignalLink from "./components/PowSignalLink";
import FooterLinks from "./components/FooterLinks";

export default function Home() {
  return (
    <>
      <Nav />
      <StackPanel />

      <div className="hero-bg">
      {/* Latest news strip */}
      <div className="newsrow">
        <span className="label">Latest</span>
        <span>Working on side projects, releasing soon.</span>
        <span className="next">Next →</span>
      </div>

      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="hero-left">
          <h1>Hi, I&apos;m <em>Nathan.</em></h1>
          <p className="sub">
            Product Leader. I build AI-driven products, platforms, and internal
            tools. Ten years shipping across healthtech, SaaS, and marketplaces.
            Ask about real work, side projects, or how I think.
          </p>
          <HeroChat />
        </div>

        <HeroMark />
      </section>
      </div>{/* /hero-bg */}

      <div className="bg-tertiary">
      {/* ─── Band ─── */}
      <section className="band">
        <svg className="icon" width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <path d="M4 14 C 8 6, 16 4, 22 10 C 28 16, 32 18, 32 18" />
          <circle cx="32" cy="18" r="1.6" fill="currentColor" />
        </svg>
        <h2>The portfolio for <em>problem solvers.</em></h2>
      </section>

      {/* ─── Triple value row ─── */}
      <div className="triple">
        <div className="tri">
          <h3>Break down problems together.</h3>
          <p>The chat builds on your question, expands on what matters, and simplifies complexity one step at a time — grounded in eight years of what I actually shipped.</p>
        </div>
        <div className="tri">
          <h3>Tackle your toughest hiring work.</h3>
          <p>Senior PM evaluation is hard. Ask specific, weird, adversarial questions and see how I think. No polished preset answers — the knowledge base is real notes, not a résumé.</p>
        </div>
        <div className="tri">
          <h3>Explore what&apos;s next.</h3>
          <p>Currently shipping PowSignal (ski-trip AI) and advising Dosable on product. Available for senior roles that need somebody who still writes code on the weekend.</p>
        </div>
      </div>
      </div>{/* /bg-tertiary */}

      {/* ─── How you can use ─── */}
      <div className="bg-tertiary">
      <UseSection />
      </div>{/* /bg-tertiary */}

      <div className="bg-secondary">
      {/* ─── 01 Work ─── */}
      <section className="section" id="work">
        <div className="section-head">
          <span className="n">01 · Work</span>
          <h2>Where I&apos;ve <em>shipped.</em></h2>
          <span className="m">2014 → now · 5 roles</span>
        </div>

        <div className="row" tabIndex={0}>
          <div className="yr">2023 — 2025</div>
          <div>
            <div className="co">Thriving Center of Psychology <span className="chev">→</span></div>
            <div className="role">Head of Product</div>
            <div className="blurb">Owned product end-to-end as the company scaled from $5M to $20M ARR. Patient onboarding, provider ops, internal tooling, data warehouse.</div>
            <ul>
              <li><b>4× revenue</b> to $20M with flat headcount</li>
              <li><b>$100K/yr saved</b> via automated contractor payroll (Rippling)</li>
              <li><b>25% faster time-to-first-session</b> via AI-assisted intake (Tellescope)</li>
              <li>Unified data warehouse across clinical, ops, and marketing</li>
            </ul>
          </div>
          <div className="stack">Rippling<br />Tellescope<br />Segment<br />dbt</div>
        </div>

        <div className="row" tabIndex={0}>
          <div className="yr">2020 — 2023</div>
          <div>
            <div className="co">Thriving Center of Psychology <span className="chev">→</span></div>
            <div className="role">Marketing &amp; Founding Product Lead</div>
            <div className="blurb">First product hire. Built the marketing engine, patient intake flow, and internal tools that would later scale to $20M.</div>
          </div>
          <div className="stack">Webflow<br />Segment<br />Airtable<br />Make</div>
        </div>

        <div className="row" tabIndex={0}>
          <div className="yr">2018 — 2020</div>
          <div>
            <div className="co">Thorsun <span className="chev">→</span></div>
            <div className="role">Head of Digital</div>
            <div className="blurb">Owned digital end-to-end for a contemporary swim label. Rebuilt commerce, paid acquisition, and email lifecycle from scratch.</div>
            <ul>
              <li><b>3× conversion lift</b>, 3% → 9%</li>
              <li><b>4.3× revenue</b> growth to $5M</li>
            </ul>
          </div>
          <div className="stack">Shopify Plus<br />Klaviyo<br />Meta Ads<br />GA4</div>
        </div>

        <div className="row" tabIndex={0}>
          <div className="yr">2014 — 2016</div>
          <div>
            <div className="co">Barneys New York <span className="chev">→</span></div>
            <div className="role">Digital Manager</div>
            <div className="blurb">Merchandising, site ops, and email for barneys.com during the final pre-acquisition growth run.</div>
          </div>
          <div className="stack">Demandware<br />ExactTarget</div>
        </div>

        <div className="row" tabIndex={0}>
          <div className="yr">2025 —</div>
          <div>
            <div className="co">Dosable <span className="chev">→</span></div>
            <div className="role">Product Lead &amp; Advisor · Contract</div>
            <div className="blurb">Product strategy and roadmap for a medication-adherence startup. Part-time, ongoing.</div>
          </div>
          <div className="stack">advisor</div>
        </div>
      </section>

      </div>{/* /bg-secondary */}

      <div className="bg-tertiary">
      {/* ─── 02 Building ─── */}
      <section className="section" id="building">
        <div className="section-head">
          <span className="n">02 · Building</span>
          <h2>Side things, <em>built recently.</em></h2>
          <span className="m">Active + past · updated 2026</span>
        </div>

        <div className="proj-grid">
          <PowSignalLink />
          <div className="proj">
            <div className="proj-status active">Advising</div>
            <h3 className="proj-title">Dosable</h3>
            <p className="proj-desc">Product strategy for a medication-adherence startup. Part-time, ongoing since 2025.</p>
            <div className="proj-tags"><span className="ptag">Healthtech</span><span className="ptag">Advisor</span></div>
          </div>
          <div className="proj">
            <div className="proj-status past">Shipped <span className="pyear">· 2024</span></div>
            <h3 className="proj-title">Onboarding AI</h3>
            <p className="proj-desc">Tellescope-backed clinician onboarding. 40% less admin, 25% faster first session.</p>
            <div className="proj-tags"><span className="ptag">Tellescope</span><span className="ptag">LLM</span></div>
          </div>
          <div className="proj">
            <div className="proj-status past">Shipped <span className="pyear">· 2022</span></div>
            <h3 className="proj-title">Payroll Bridge</h3>
            <p className="proj-desc">Rippling + Airtable automation that replaced a contractor billing spreadsheet. $100K/yr saved.</p>
            <div className="proj-tags"><span className="ptag">Rippling</span><span className="ptag">Airtable</span><span className="ptag">Make</span></div>
          </div>
        </div>
      </section>

      </div>{/* /bg-tertiary */}

      <div className="bg-secondary">
      {/* ─── 03 About ─── */}
      <section className="section about" id="about">
        <div className="section-head">
          <span className="n">03 · About</span>
          <h2>A bit more <em>about me.</em></h2>
          <span className="m">New York · open to senior roles</span>
        </div>

        <div className="about-grid">
          <div className="about-photo">
            <div className="photo-frame">
              <Image
                src="/nathan-bw.png"
                alt="Nathan Holt"
                className="photo-img"
                width={600}
                height={750}
                priority
              />
            </div>
            <div className="now">
              <div className="now-dot" />
              <div>
                <div className="now-lbl">Now</div>
                <div className="now-txt">Shipping PowSignal &apos;26 beta. Advising Dosable. Reading about clinical trial design.</div>
              </div>
            </div>
          </div>
          <div className="about-copy">
            <p>I&apos;m a product lead who still writes code on the weekend. Eight years across healthtech, consumer SaaS, and ecommerce — most recently as Head of Product at Thriving Center of Psychology, where we 4×&apos;d revenue with flat headcount.</p>
            <p>I like problems that sit at the boundary between operational chaos and something a machine can now do well. Onboarding flows, internal tools, ingestion pipelines, the glue between humans and LLMs. The stuff that makes a company feel lighter from the inside.</p>
            <p>Based in New York. Open to senior IC or head-of-product roles — full-time, contract, or advisor. Happiest when I can sit next to engineering and talk to customers the same day.</p>
            <AboutActions />
            <a className="email-link" href="mailto:nathanholt925@gmail.com?subject=Reaching%20out%20from%20your%20site">nathanholt925@gmail.com</a>
            <AboutChips />
          </div>
        </div>
      </section>

      </div>{/* /bg-secondary */}

      <div className="bg-tertiary">
      {/* ─── Keep thinking ─── */}
      <section className="keep">
        <div className="eye">Still reading? Let&apos;s talk.</div>
        <h2>There&apos;s never been a better time to <em>hire a problem solver.</em></h2>
        <PresetGrid />
        <div className="promptbox">
          <div className="q">Or ask your own —</div>
          <div className="field" style={{ flex: 1, textAlign: "right" }}>Type in the chat at the top ↑</div>
          <KeepGoButton />
        </div>
      </section>

      </div>{/* /bg-tertiary */}

      <div className="bg-primary">
      {/* ─── Footer ─── */}
      <footer>
        <div className="footwrap">
          <div className="f-brand">
            <a className="brand" href="/">Nathan Holt</a>
            <div className="b2">Product Lead based in New York. Currently shipping PowSignal.</div>
            <a className="f-avail" href="#about">Open to senior roles</a>
            <FooterLinks />
          </div>
          <div className="fcol">
            <h5>Work</h5>
            <ul>
              <li><a href="#work">All roles</a></li>
              <li><a href="#work">Thriving Center</a></li>
              <li><a href="#work">Thorsun</a></li>
              <li><a href="#work">Barneys</a></li>
              <li><a href="#work">Dosable</a></li>
            </ul>
          </div>
          <div className="fcol">
            <h5>Building</h5>
            <ul>
              <li><a href="#building">PowSignal</a></li>
              <li><a href="#building">Side projects</a></li>
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
              <li>
                <button
                  className="footer-cal-link"
                  data-cal-namespace="meeting"
                  data-cal-link="nateholt/meeting"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"dark"}'
                >Schedule a call</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="footend">
          <span>© 2026 Nathan Holt</span>
          <span>Based in New York</span>
          <span className="icons">◐ ◑ ◉ ◎</span>
        </div>
      </footer>
      </div>{/* /bg-primary */}
    </>
  );
}
