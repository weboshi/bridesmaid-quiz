'use client'

import { useState, useEffect, useRef } from 'react'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
const ORDINALS = [
  'The First Revelation',
  'The Second Vision',
  'The Third Omen',
  'The Fourth Sign',
  'The Fifth Mystery',
  'The Sixth Omen',
  'The Final Prophecy',
]
const GLYPHS = ['✦', '◈', '⬡', '✧']

type Question =
  | { text: string; inputType: 'year' | 'date' }
  | { text: string; options: string[] }
  | { text: string; isReveal: true }

const questions: Question[] = [
  { text: "In which year did the universe place you upon this earth?", inputType: 'year' },
  {
    text: "Under which celestial sign were you born?",
    options: [
      "🔥 The Fire Signs — Aries, Leo, Sagittarius",
      "🌿 The Earth Signs — Taurus, Virgo, Capricorn",
      "💨 The Air Signs — Gemini, Libra, Aquarius",
      "🌊 The Water Signs — Cancer, Scorpio, Pisces",
    ],
  },
  {
    text: "How do you walk through this world?",
    options: ["As a woman", "As a man", "Beyond the binary", "That is mine alone to know"],
  },
  {
    text: "Your friend makes a decision you disagree with. What do you do?",
    options: [
      "Stay quiet — it's their life, not yours.",
      "Say your piece once, then let it go.",
      "Ask questions until you understand them.",
      "Change the subject and hope for the best.",
    ],
  },
  {
    text: "In the language of souls, how do you love those closest to you?",
    options: [
      "Through presence — time is the holiest offering",
      "Through deeds — you act before they even ask",
      "Through praise — their victories belong to you both",
      "Through depth — you seek the truths they hide from others",
    ],
  },
  { text: "What is today's date?", inputType: 'date' },
  {
    text: "",
    isReveal: true
  },
]

type Phase = 'quiz' | 'bridesmaid' | 'thankyou'

function launchConfetti() {
  const colors = ['#7B4FD4', '#D4A843', '#C4A8FF', '#9D6FE8', '#F0CC78', '#fff']
  for (let i = 0; i < 45; i++) {
    const el = document.createElement('div')
    const angle = Math.random() * 360
    const dist = 90 + Math.random() * 190
    const size = 5 + Math.random() * 7
    const tx = (Math.cos((angle * Math.PI) / 180) * dist).toFixed(0)
    const ty = (Math.sin((angle * Math.PI) / 180) * dist - 90).toFixed(0)
    const rot = (Math.random() * 720).toFixed(0)
    el.style.cssText = `position:fixed;top:50%;left:50%;width:${size}px;height:${size}px;border-radius:${Math.random() > 0.5 ? '50%' : '2px'};background:${colors[Math.floor(Math.random() * colors.length)]};animation:confettiBurst ${(1 + Math.random() * 0.7).toFixed(2)}s ease ${(Math.random() * 0.25).toFixed(2)}s forwards;--tx:${tx}px;--ty:${ty}px;--rot:${rot}deg;pointer-events:none;z-index:1000;`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 2200)
  }
}

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>('quiz')
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [canContinue, setCanContinue] = useState(false)
  const [slideOut, setSlideOut] = useState(false)
  const [revealSelected, setRevealSelected] = useState(false)
  const [yesBtnSelected, setYesBtnSelected] = useState(false)
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null)

  const starsRef = useRef<HTMLDivElement>(null)
  const yesBtnRef = useRef<HTMLDivElement>(null)

  // Generate stars
  useEffect(() => {
    const container = starsRef.current
    if (!container) return
    for (let i = 0; i < 120; i++) {
      const s = document.createElement('div')
      const size = Math.random() * 2.2 + 0.5
      s.className = 'star'
      s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random() * 100}%;left:${Math.random() * 100}%;animation-duration:${2 + Math.random() * 4}s;animation-delay:${Math.random() * 5}s;`
      container.appendChild(s)
    }
    return () => { container.innerHTML = '' }
  }, [])

  function handleNoClick() {
    const w = 140, h = 52
    const x = 16 + Math.random() * (window.innerWidth - w - 32)
    const y = 16 + Math.random() * (window.innerHeight - h - 32)
    setNoButtonPos({ x, y })
  }

  const q = questions[currentQ]
  const isRevealQ = 'isReveal' in q
  const showHeaderAndProgress = phase === 'quiz' && currentQ < questions.length - 1

  function advance() {
    if (!canContinue) return
    setSlideOut(true)
    setTimeout(() => {
      setCurrentQ(c => c + 1)
      setSelectedIdx(null)
      setInputValue('')
      setCanContinue(false)
      setSlideOut(false)
    }, 350)
  }

  function handleReveal() {
    if (revealSelected) return
    setRevealSelected(true)
    launchConfetti()
    setTimeout(launchConfetti, 400)
    setTimeout(() => setPhase('bridesmaid'), 900)
  }

  function handleYes() {
    if (yesBtnSelected) return
    setYesBtnSelected(true)
    launchConfetti()
    setTimeout(launchConfetti, 400)
    setTimeout(() => setPhase('thankyou'), 800)
  }

  return (
    <>
      <div className="stars" ref={starsRef} />

      {/* Fleeing No button - rendered outside container to escape overflow:hidden */}
      {phase === 'bridesmaid' && !yesBtnSelected && noButtonPos && (
        <div
          className="option"
          style={{
            position: 'fixed',
            left: noButtonPos.x,
            top: noButtonPos.y,
            width: '140px',
            height: '52px',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 9999,
            transition: 'left 0.3s ease, top 0.3s ease',
          }}
          onClick={handleNoClick}
        >
          <span className="option-text" style={{ fontStyle: 'normal' }}>No</span>
        </div>
      )}

      <div className="container">

        {/* Header */}
        {showHeaderAndProgress && (
          <div className="quiz-header">
            <span className="oracle-icon">🔮</span>
            <div className="eyebrow">✦ The Oracle Awaits ✦</div>
            <h1>What Does the<br />Universe See in You?</h1>
            <div className="divider"><span>✦ ✦ ✦</span></div>
            <p>The stars have been watching. Answer truthfully — the oracle cannot be deceived.</p>
          </div>
        )}

        {/* Progress */}
        {showHeaderAndProgress && (
          <div className="progress-wrap">
            <div className="progress-dots">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`dot${i < currentQ ? ' done' : i === currentQ ? ' active' : ''}`}
                />
              ))}
            </div>
            <div className="progress-label">{ROMAN[currentQ]} of VI</div>
          </div>
        )}

        {/* Quiz Card */}
        {phase === 'quiz' && (
          <div key={currentQ} className={`card ${slideOut ? 'slide-out' : 'slide-in'}`}>
            <div className="question-num">{ORDINALS[currentQ]}</div>
            <div className="question-text">{q.text}</div>

            {/* Year input */}
            {'inputType' in q && q.inputType === 'year' && (
              <div className="year-input-wrap">
                <input
                  className="year-input"
                  type="number"
                  min={1900}
                  max={2025}
                  placeholder="YYYY"
                  value={inputValue}
                  autoComplete="off"
                  autoFocus
                  onChange={e => {
                    setInputValue(e.target.value)
                    const n = parseInt(e.target.value)
                    setCanContinue(e.target.value.length === 4 && n >= 1900 && n <= 2025)
                  }}
                  onKeyDown={e => e.key === 'Enter' && canContinue && advance()}
                />
                <span className="year-hint">Enter your birth year</span>
              </div>
            )}

            {/* Date input */}
            {'inputType' in q && q.inputType === 'date' && (
              <div className="year-input-wrap">
                <input
                  className="year-input"
                  type="date"
                  value={inputValue}
                  autoComplete="off"
                  autoFocus
                  onChange={e => {
                    setInputValue(e.target.value)
                    setCanContinue(!!e.target.value)
                  }}
                  onKeyDown={e => e.key === 'Enter' && canContinue && advance()}
                />
                <span className="year-hint">Enter today&apos;s date</span>
              </div>
            )}

            {/* Multiple choice */}
            {'options' in q && (
              <div className="options">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`option${selectedIdx === i ? ' selected' : ''}`}
                    onClick={() => { setSelectedIdx(i); setCanContinue(true) }}
                  >
                    <span className="option-glyph">{GLYPHS[i]}</span>
                    <span className="option-text">{opt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reveal option */}
            {isRevealQ && (
              <div className="options">
                <div
                  className={`option${revealSelected ? ' selected' : ''}`}
                  onClick={handleReveal}
                  style={{ justifyContent: 'center', textAlign: 'center' }}
                >
                  <span className="option-text" style={{ fontStyle: 'normal', letterSpacing: '0.04em' }}>
                    Reveal my prophecy for next year
                  </span>
                </div>
              </div>
            )}

            {/* Continue button (not shown for reveal question) */}
            {!isRevealQ && (
              <button
                className={`btn-next${canContinue ? ' visible' : ''}`}
                onClick={advance}
              >
                ✦ Reveal the Next ✦
              </button>
            )}
          </div>
        )}

        {/* Bridesmaid Phase */}
        {phase === 'bridesmaid' && (
          <div className="card" style={{ animation: 'fadeUp 0.7s ease both', textAlign: 'center' }}>
            <div className="question-num" style={{ justifyContent: 'center' }}>✦ The True Prophecy ✦</div>
            <div className="question-text" style={{ textAlign: 'center' }}>
              Will you be my Flower Girl?{'\n'}March 27th, 2027
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div
                  ref={yesBtnRef}
                  className={`option${yesBtnSelected ? ' selected' : ''}`}
                  style={{ width: '140px', height: '52px', justifyContent: 'center', textAlign: 'center', flexShrink: 0 }}
                  onClick={handleYes}
                >
                  <span className="option-text" style={{ fontStyle: 'normal' }}>Yes</span>
                </div>
                {!yesBtnSelected && !noButtonPos && (
                  <div
                    className="option"
                    style={{ width: '140px', height: '52px', justifyContent: 'center', textAlign: 'center', flexShrink: 0 }}
                    onClick={handleNoClick}
                  >
                    <span className="option-text" style={{ fontStyle: 'normal' }}>No</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Thank You Phase */}
        {phase === 'thankyou' && (
          <div className="card" style={{ animation: 'fadeUp 0.7s ease both', textAlign: 'center', lineHeight: 2 }}>
            <div className="question-num" style={{ justifyContent: 'center', marginBottom: '1.2rem' }}>✦ ✦ ✦</div>
            <div className="question-text" style={{ fontSize: 'clamp(1.3rem, 4vw, 1.7rem)', marginBottom: '0.5rem' }}>
              Yayyy Thank you! 🎉
            </div>
            <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1.4rem', color: 'var(--lavender)', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '0.4rem' }}>
              You have exactly one year to prepare your flower cannon!
            </p>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.9rem', color: 'var(--gold)', letterSpacing: '0.12em', marginTop: '0.8rem' }}>
              Ciao 👋
            </p>

            <img
              src="/fortune-teller.jpg"
              alt="Your Fortune Teller"
              style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--violet)', boxShadow: '0 0 24px rgba(123,79,212,0.4)', display: 'block', margin: '0 auto' }}
            />
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '1.8rem', marginBottom: '0.8rem' }}>
              Your Fortune Teller
            </p>
          </div>
        )}

      </div>
    </>
  )
}
