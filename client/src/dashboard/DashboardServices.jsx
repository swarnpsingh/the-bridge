import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getServices, createService, deleteService } from '../api';

const CATEGORIES = ['All','Design','Tech','Marketing','Legal','Finance','Other'];

const categoryColors = {
  Design:    { bg: '#fce7f3', color: '#9d174d' },
  Tech:      { bg: '#dbeafe', color: '#1e40af' },
  Marketing: { bg: '#d1fae5', color: '#065f46' },
  Legal:     { bg: '#fee2e2', color: '#991b1b' },
  Finance:   { bg: '#fef3c7', color: '#92400e' },
  Other:     { bg: '#f3f4f6', color: '#374151' },
};

const avatarColors = ['#e0e7ff','#fce7f3','#d1fae5','#fef3c7','#dbeafe','#fee2e2'];
const avatarText   = ['#4338ca','#9d174d','#065f46','#92400e','#1e40af','#991b1b'];
const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';

const EMPTY_FORM = {
  title: '', description: '', category: 'Tech', type: 'Offered',
};

export default function DashboardServices() {
  const { user } = useAuth();

  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('Offered');
  const [category, setCategory]   = useState('All');
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [contactModal, setContactModal]   = useState(null);
  const [focused, setFocused]     = useState({});

  const load = () => {
    setLoading(true);
    const params = { type: tab };
    if (category !== 'All') params.category = category;
    getServices(params)
      .then(r => setServices(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [tab, category]);

  const field  = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const onFocus = (k)   => setFocused(f => ({ ...f, [k]: true }));
  const onBlur  = (k)   => setFocused(f => ({ ...f, [k]: false }));

  const inputStyle = (k) => ({
    width: '100%', padding: '10px 14px',
    border: `1px solid ${focused[k] ? '#1a1a1a' : '#e5e5e5'}`,
    borderRadius: 8, fontSize: 14, color: '#1a1a1a',
    outline: 'none', background: '#fafafa',
    transition: 'border-color 0.15s',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Please enter a title.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await createService({ ...form, postedBy: user._id });
      setForm(EMPTY_FORM);
      setShowForm(false);
      setTab(form.type);
      load();
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setDeleteConfirm(null);
      load();
    } catch {
      alert('Could not delete. Please try again.');
    }
  };

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
      border: active ? '1.5px solid #1a1a1a' : '1px solid #e5e5e5',
      background: active ? '#1a1a1a' : '#fff',
      color: active ? '#fff' : '#555',
      cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );

  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 20,
                    flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a',
                       letterSpacing: '-0.5px', marginBottom: 4 }}>
            Services exchange
          </h1>
          <p style={{ fontSize: 14, color: '#888' }}>
            Offer your skills or ask the community for help.
          </p>
        </div>
        <button onClick={() => { setShowForm(true); setFormError(''); }} style={{
          padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          background: '#1a1a1a', color: '#fff', border: 'none', cursor: 'pointer',
        }}>
          + Post a service
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ebebeb', marginBottom: 16 }}>
        {['Offered', 'Requested'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', fontSize: 13, fontWeight: tab === t ? 600 : 400,
            color: tab === t ? '#1a1a1a' : '#888',
            borderBottom: tab === t ? '2px solid #1a1a1a' : '2px solid transparent',
            background: 'none', border: 'none',
            borderBottomStyle: 'solid',
            cursor: 'pointer', transition: 'all 0.15s',
            marginBottom: -1,
          }}>
            {t === 'Offered' ? '🙋 Offered' : '🙏 Requested'}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <Chip key={c} label={c}
            active={category === c}
            onClick={() => setCategory(c)} />
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0',
                      color: '#aaa', fontSize: 14 }}>
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #ebebeb',
          borderRadius: 14, padding: '60px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>
            {tab === 'Offered' ? '🙋' : '🙏'}
          </div>
          <p style={{ fontSize: 15, fontWeight: 600,
                      color: '#1a1a1a', marginBottom: 6 }}>
            No {tab.toLowerCase()} services yet
          </p>
          <p style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>
            {tab === 'Offered'
              ? 'Be the first to offer a skill to the community.'
              : 'Be the first to ask the community for help.'}
          </p>
          <button onClick={() => {
            setForm(f => ({ ...f, type: tab }));
            setShowForm(true);
          }} style={{
            padding: '10px 22px', borderRadius: 8,
            background: '#1a1a1a', color: '#fff',
            fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
          }}>
            Post a service
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {services.map((s, i) => {
            const cs    = categoryColors[s.category] || categoryColors.Other;
            const isMe  = s.postedBy?._id === user?._id ||
                          s.postedBy === user?._id;
            const poster = s.postedBy;

            return (
              <div key={s._id} style={{
                background: '#fff',
                border: `1px solid ${isMe ? '#c7d2fe' : '#ebebeb'}`,
                borderRadius: 14, padding: 20,
                position: 'relative',
                transition: 'transform 0.15s, border-color 0.15s',
                display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  if (!isMe) e.currentTarget.style.borderColor = '#d0d0d0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isMe ? '#c7d2fe' : '#ebebeb';
                }}
              >
                {/* "Mine" badge */}
                {isMe && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    fontSize: 10, padding: '2px 8px', borderRadius: 20,
                    background: '#e0e7ff', color: '#4338ca', fontWeight: 600,
                  }}>
                    Mine
                  </div>
                )}

                {/* Category tag */}
                <div style={{ marginBottom: 10 }}>
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 20,
                    background: cs.bg, color: cs.color, fontWeight: 500,
                  }}>
                    {s.category}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a',
                             marginBottom: 6, lineHeight: 1.3 }}>
                  {s.title}
                </h3>

                {/* Description */}
                {s.description && (
                  <p style={{
                    fontSize: 12, color: '#777', lineHeight: 1.55,
                    marginBottom: 14, flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {s.description}
                  </p>
                )}

                {/* Posted by */}
                {poster && typeof poster === 'object' && (
                  <div style={{ display: 'flex', alignItems: 'center',
                                gap: 8, marginBottom: 14 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: avatarColors[i % avatarColors.length],
                      color: avatarText[i % avatarText.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, flexShrink: 0,
                    }}>
                      {initials(poster.name)}
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {poster.name}
                      {poster.memberType && (
                        <span style={{ color: '#bbb' }}> · {poster.memberType}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ borderTop: '1px solid #f5f5f5', paddingTop: 14 }}>
                  {isMe ? (
                    <button onClick={() => setDeleteConfirm(s)} style={{
                      width: '100%', padding: '8px', borderRadius: 8, fontSize: 12,
                      border: '1px solid #fecaca', color: '#dc2626',
                      background: '#fff1f1', cursor: 'pointer', fontWeight: 500,
                    }}>
                      Remove listing
                    </button>
                  ) : (
                    <button onClick={() => setContactModal(s)} style={{
                      width: '100%', padding: '8px', borderRadius: 8, fontSize: 12,
                      background: '#1a1a1a', color: '#fff',
                      border: 'none', cursor: 'pointer', fontWeight: 500,
                    }}>
                      {tab === 'Offered' ? 'Express interest →' : 'Offer to help →'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Post a service modal ──────────────────────────── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: 24,
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32,
            width: '100%', maxWidth: 480,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>
                Post a service
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background: 'none', border: 'none', fontSize: 20,
                cursor: 'pointer', color: '#aaa',
              }}>×</button>
            </div>

            <form onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Type toggle */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                                color: '#555', marginBottom: 8 }}>
                  I want to...
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['Offered', 'Requested'].map(t => (
                    <button key={t} type="button"
                      onClick={() => field('type', t)} style={{
                        flex: 1, padding: '10px', borderRadius: 8, fontSize: 13,
                        border: form.type === t
                          ? '2px solid #1a1a1a' : '1px solid #e5e5e5',
                        background: form.type === t ? '#1a1a1a' : '#fff',
                        color: form.type === t ? '#fff' : '#555',
                        cursor: 'pointer', fontWeight: 500,
                        transition: 'all 0.15s',
                      }}>
                      {t === 'Offered' ? '🙋 Offer a service' : '🙏 Request help'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                                color: '#555', marginBottom: 8 }}>
                  Category
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <button key={c} type="button"
                      onClick={() => field('category', c)} style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: 12,
                        border: form.category === c
                          ? '1.5px solid #1a1a1a' : '1px solid #e5e5e5',
                        background: form.category === c ? '#1a1a1a' : '#fff',
                        color: form.category === c ? '#fff' : '#555',
                        cursor: 'pointer', fontWeight: 500,
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                                color: '#555', marginBottom: 6 }}>
                  Title <span style={{ color: '#e55' }}>*</span>
                </label>
                <input style={inputStyle('title')}
                  placeholder={form.type === 'Offered'
                    ? 'e.g. UX design review, React development'
                    : 'e.g. Need a logo designer, Looking for legal advice'}
                  value={form.title}
                  onChange={e => field('title', e.target.value)}
                  onFocus={() => onFocus('title')}
                  onBlur={() => onBlur('title')} />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                                color: '#555', marginBottom: 6 }}>
                  Description
                </label>
                <textarea style={{ ...inputStyle('desc'), height: 90, resize: 'vertical' }}
                  placeholder={form.type === 'Offered'
                    ? 'Describe what you offer and any conditions...'
                    : 'Describe what you need and any details...'}
                  value={form.description}
                  onChange={e => field('description', e.target.value)}
                  onFocus={() => onFocus('desc')}
                  onBlur={() => onBlur('desc')} />
              </div>

              {formError && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: '#fff1f1', border: '1px solid #fecaca',
                  fontSize: 13, color: '#dc2626',
                }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  padding: '11px 18px', borderRadius: 8, fontSize: 13,
                  border: '1px solid #e5e5e5', background: '#fff',
                  color: '#555', cursor: 'pointer', fontWeight: 500,
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={{
                  flex: 1, padding: '11px', borderRadius: 8, fontSize: 13,
                  background: submitting ? '#999' : '#1a1a1a', color: '#fff',
                  border: 'none', fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}>
                  {submitting ? 'Posting...' : 'Post listing →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Contact modal ─────────────────────────────────── */}
      {contactModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: 24,
        }}
          onClick={e => { if (e.target === e.currentTarget) setContactModal(null); }}
        >
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32,
            width: '100%', maxWidth: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'flex-start', marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>
                Get in touch
              </h2>
              <button onClick={() => setContactModal(null)} style={{
                background: 'none', border: 'none', fontSize: 20,
                cursor: 'pointer', color: '#aaa',
              }}>×</button>
            </div>

            <p style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
              Interested in:
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a',
                        marginBottom: 20 }}>
              {contactModal.title}
            </p>

            {contactModal.postedBy?.email ? (
              <>
                <p style={{ fontSize: 13, color: '#666', marginBottom: 20,
                            lineHeight: 1.6 }}>
                  Reach out directly to{' '}
                  <strong>{contactModal.postedBy?.name}</strong> via email:
                </p>
                <a href={`mailto:${contactModal.postedBy.email}?subject=Re: ${contactModal.title} on The Bridge`}
                  style={{
                    display: 'block', textAlign: 'center',
                    padding: '12px', borderRadius: 8, fontSize: 13,
                    background: '#1a1a1a', color: '#fff',
                    fontWeight: 600, textDecoration: 'none',
                  }}>
                  Send email →
                </a>
                {contactModal.postedBy?.linkedin && (
                  <a href={contactModal.postedBy.linkedin.startsWith('http')
                      ? contactModal.postedBy.linkedin
                      : `https://${contactModal.postedBy.linkedin}`}
                    target="_blank" rel="noreferrer"
                    style={{
                      display: 'block', textAlign: 'center', marginTop: 10,
                      padding: '12px', borderRadius: 8, fontSize: 13,
                      border: '1px solid #e5e5e5', color: '#555',
                      fontWeight: 500, textDecoration: 'none',
                    }}>
                    View LinkedIn
                  </a>
                )}
              </>
            ) : (
              <p style={{ fontSize: 13, color: '#aaa' }}>
                Contact details not available.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ──────────────────────────── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: 24,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32,
            width: '100%', maxWidth: 380,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a',
                         marginBottom: 8 }}>
              Remove listing?
            </h2>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
              This will permanently remove <strong>{deleteConfirm.title}</strong> from
              the services exchange.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                flex: 1, padding: '11px', borderRadius: 8, fontSize: 13,
                border: '1px solid #e5e5e5', background: '#fff',
                color: '#555', cursor: 'pointer', fontWeight: 500,
              }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm._id)} style={{
                flex: 1, padding: '11px', borderRadius: 8, fontSize: 13,
                background: '#dc2626', color: '#fff',
                border: 'none', cursor: 'pointer', fontWeight: 600,
              }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}