"use client";

// Inspired by Team Lanyard Rail (21st.dev, MIT, @dhxwhy) — rebuilt light for
// Rick's Works section. No drag physics / spring sway; hover lift + flip only,
// horizontal snap carousel on touch devices. Click flips then opens the
// template's existing details sheet.

import * as React from "react"

export type WorksLanyardTone = "blue" | "green" | "orange" | "yellow"
export type WorksLanyardPalette = Record<WorksLanyardTone, string>

export type WorksLanyardProject = {
  title: string
  category: string
  year: string
  summary: string
  tools?: string[]
  image?: string
  role?: string
}

type Props = {
  projects: WorksLanyardProject[]
  /** Global index of each shown project (into the template's projects array) */
  indices: number[]
  catLabel: (category: string) => string
  toneOf: (category: string) => WorksLanyardTone
  palette: WorksLanyardPalette
  onOpen: (globalIndex: number) => void
}

// Keep year display sane (App currently derives year from slug, e.g. "autotube-tau").
function prettyYear(year: string, fallback = "2026") {
  if (/^\d{4}(-\d{4})?$/.test(year.trim())) return year.trim()
  return fallback
}

export default function WorksLanyardRail({
  projects,
  indices,
  catLabel,
  toneOf,
  palette,
  onOpen,
}: Props) {
  const [flipping, setFlipping] = React.useState<number | null>(null)
  const [caption, setCaption] = React.useState<string>(
    "Rail · Eight boards — click any badge to flip and open details."
  )
  const timers = React.useRef<number[]>([])

  React.useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    },
    []
  )

  const reducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const handleOpen = (globalIndex: number, k: number) => {
    const p = projects[k]
    setCaption(`Flipping ${p.title} — opening details.`)
    if (reducedMotion()) {
      setCaption(`${p.title} — details open.`)
      onOpen(globalIndex)
      return
    }
    setFlipping(globalIndex)
    const t = window.setTimeout(() => {
      setCaption(`${p.title} — details open.`)
      onOpen(globalIndex)
      setFlipping(null)
    }, 420)
    timers.current.push(t)
  }

  if (!projects.length) return null

  return (
    <div className="lanyard-rail">
      <div className="lanyard-rail-head">
        <p className="lanyard-eyebrow">
          Lanyard rail · {String(projects.length).padStart(2, "0")} badges
        </p>
        <p className="lanyard-hint">Pull along the rail, click a badge to flip it open.</p>
      </div>

      <div className="lanyard-rail-track" role="list" aria-label="Projects hanging from a rail — activate a badge to open its details">
        <div className="lanyard-rail-bar" aria-hidden="true" />
        {projects.map((p, k) => {
          const globalIndex = indices[k] ?? k
          const tone = toneOf(p.category)
          const accentVar = ({ blue: "var(--ftp-blue)", green: "var(--ftp-green)", orange: "var(--ftp-orange)", yellow: "var(--ftp-yellow)" } as Record<WorksLanyardTone, string>)[tone] || palette[tone] || palette.blue
          const isFlipping = flipping === globalIndex
          return (
            <article
              key={p.title + "-" + globalIndex}
              className={"lanyard-item" + (isFlipping ? " is-flipping" : "")}
              role="listitem"
              style={{ "--accent": accentVar } as React.CSSProperties}
            >
              <div className="lanyard-cord" aria-hidden="true" />
              <div className="lanyard-clip" aria-hidden="true"><span /></div>

              <button
                type="button"
                className="lanyard-badge"
                aria-haspopup="dialog"
                aria-label={`${p.title}, ${catLabel(p.category)}, ${prettyYear(p.year)}. Open details`}
                onClick={() => handleOpen(globalIndex, k)}
              >
                <span className="lanyard-inner">
                  {/* Front */}
                  <span className="lanyard-face lanyard-front">
                    <span className="lanyard-badge-top">
                      <span className="lanyard-dot" />
                      <span className="lanyard-badge-top-txt">
                        {catLabel(p.category)} · {prettyYear(p.year)}
                      </span>
                    </span>
                    <span className="lanyard-photo">
                      {p.image ? (
                        <img src={p.image} alt="" width={320} height={220} />
                      ) : (
                        <span className="lanyard-photo-fallback">{p.title.slice(0, 2)}</span>
                      )}
                    </span>
                    <span className="lanyard-badge-body">
                      <span className="lanyard-title">{p.title}</span>
                      <span className="lanyard-role">{p.role || p.summary}</span>
                      {!!p.tools?.length && (
                        <span className="lanyard-tags">
                          {p.tools.slice(0, 3).map((t) => (
                            <span key={t} className="lanyard-tag">{t}</span>
                          ))}
                        </span>
                      )}
                    </span>
                    <span className="lanyard-badge-foot">
                      <span>Flip to open</span>
                      <span aria-hidden="true">↗</span>
                    </span>
                  </span>

                  {/* Back — brief flip cue, then the details sheet takes over */}
                  <span className="lanyard-face lanyard-back" aria-hidden="true">
                    <span className="lanyard-badge-top"><span className="lanyard-dot" /><span>OPENING DETAILS</span></span>
                    <span className="lanyard-back-title">{p.title}</span>
                    <span className="lanyard-back-text">{p.summary}</span>
                    <span className="lanyard-back-foot">Visit inside the sheet →</span>
                  </span>
                </span>
              </button>
            </article>
          )
        })}
      </div>

      <p className="lanyard-caption" aria-live="polite">{caption}</p>
    </div>
  )
}
