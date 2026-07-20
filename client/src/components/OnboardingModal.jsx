import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';

const SLIDES = [
  {
    icon: '🎉',
    title: "You're on The Bridge!",
    body: "Your profile is live. Here's a 30-second look at how to get the most out of the community.",
  },
  {
    icon: '👥',
    title: 'Meet the community',
    body: 'Browse member profiles, filter by role, and reach out directly to founders, mentors and builders.',
  },
  {
    icon: '📅',
    title: 'Show up to events',
    body: 'Fireside chats, workshops and meetups — curated by Bridgemakers and open to every member.',
  },
  {
    icon: '🤝',
    title: 'Post your first exchange',
    body: "Offer a skill or ask the community for help. It's the fastest way to get real value out of The Bridge.",
    isFinal: true,
  },
];

export default function OnboardingModal() {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const [step, setStep] = useState(0);
  const cardRef = useRef(null);

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  const next = () => setStep(s => Math.min(s + 1, SLIDES.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const finish = () => navigate('/dashboard', { replace: true });
  const goPostExchange = () => navigate('/dashboard/exchanges?post=1', { replace: true });

  const onKeyDown = (e) => {
    if (e.key === 'Escape') finish();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') back();
  };

  const btnBase = {
    padding: '12px 20px', borderRadius: 999, fontSize: 13.5, fontWeight: 600,
    border: 'none', cursor: 'pointer', transition: 'transform 0.15s, opacity 0.15s',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'var(--overlay)',
        backdropFilter: 'blur(6px)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 300, padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) finish(); }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        style={{
          position: 'relative', width: '100%', maxWidth: 440,
          background: 'var(--surface-solid)', border: '1px solid var(--border)',
          borderRadius: 24, padding: isMobile ? '32px 24px 24px' : '40px 36px 28px',
          boxShadow: 'var(--shadow-strong)', outline: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.16), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Skip */}
        <button
          onClick={finish}
          aria-label="Skip tour"
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)',
            padding: '6px 10px', borderRadius: 8, transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-muted)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
        >
          Skip
        </button>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Go to slide ${i + 1} of ${SLIDES.length}`}
              aria-current={i === step}
              style={{
                width: i === step ? 22 : 7, height: 7, borderRadius: 999,
                background: i === step
                  ? 'linear-gradient(135deg, var(--brand), var(--brand-strong))'
                  : 'var(--border)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width 0.25s ease, background 0.25s ease',
              }}
            />
          ))}
        </div>

        {/* Slide content */}
        <div key={step} className="anim-fade-in" style={{ position: 'relative', minHeight: isMobile ? 150 : 170 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--brand-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, marginBottom: 18,
          }}>
            {slide.icon}
          </div>
          <h2 id="onboarding-title" style={{
            fontSize: 20, fontWeight: 800, color: 'var(--text-strong)',
            letterSpacing: '-0.4px', marginBottom: 8,
          }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {slide.body}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 28, alignItems: 'center' }}>
          {step > 0 && (
            <button onClick={back} style={{
              ...btnBase, background: 'var(--surface-muted)',
              border: '1px solid var(--border)', color: 'var(--text-muted)',
            }}>
              Back
            </button>
          )}

          {!isLast ? (
            <button onClick={next} style={{
              ...btnBase, flex: 1,
              background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
              color: 'var(--brand-contrast)',
            }}>
              Next →
            </button>
          ) : (
            <>
              <button onClick={finish} style={{
                ...btnBase, background: 'var(--surface-muted)',
                border: '1px solid var(--border)', color: 'var(--text-muted)',
              }}>
                Later
              </button>
              <button
                onClick={goPostExchange}
                className="anim-cta-glow"
                style={{
                  ...btnBase, flex: 1,
                  background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
                  color: 'var(--brand-contrast)',
                }}
              >
                Post an exchange →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
