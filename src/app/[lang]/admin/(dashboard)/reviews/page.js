'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const Spinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const Stars = ({ n }) => Array.from({ length: 5 }).map((_, i) => (
  <svg key={i} className="w-3.5 h-3.5 inline-block" viewBox="0 0 24 24" fill={i < n ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-gold)' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
));

export default function AdminReviewsPage() {
  const { lang = 'tr' } = useParams();
  const isEn = lang === 'en';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [saving,  setSaving]  = useState({});

  const [modal,    setModal]   = useState(false);
  const [editing,  setEditing] = useState(null);
  const [author,   setAuthor]  = useState('');
  const [rating,   setRating]  = useState(5);
  const [contentTr, setContentTr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [approved, setApproved]   = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [formError,  setFormError]  = useState('');

  const load = () => fetch('/api/reviews').then(r => r.ok ? r.json() : []).then(d => { setReviews(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const toggle = async (rv) => {
    setSaving(s => ({ ...s, [rv.id]: true }));
    await fetch(`/api/reviews/${rv.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: !rv.approved }),
    });
    await load();
    setSaving(s => ({ ...s, [rv.id]: false }));
  };

  const del = async (id) => {
    if (!confirm(isEn ? 'Delete this review?' : 'Bu yorumu sil?')) return;
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    load();
  };

  const openAdd = () => {
    setEditing(null); setAuthor(''); setRating(5);
    setContentTr(''); setContentEn(''); setApproved(true); setFormError(''); setModal(true);
  };

  const openEdit = (rv) => {
    setEditing(rv); setAuthor(rv.author || ''); setRating(rv.rating || 5);
    setContentTr(rv.contentTr || ''); setContentEn(rv.contentEn || '');
    setApproved(rv.approved); setFormError(''); setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault(); setFormSaving(true); setFormError('');
    try {
      const url = editing ? `/api/reviews/${editing.id}` : '/api/reviews';
      const r = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, rating, contentTr, contentEn, approved }),
      });
      if (!r.ok) throw new Error((await r.json()).error || 'Error');
      setModal(false); load();
    } catch (e) { setFormError(e.message); }
    finally { setFormSaving(false); }
  };

  const filtered = filter === 'all' ? reviews : reviews.filter(r => filter === 'approved' ? r.approved : !r.approved);

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center" style={{ color: 'var(--color-gold)' }}>
      <Spinner />
    </div>
  );

  const approved_count = reviews.filter(r => r.approved).length;
  const pending_count  = reviews.filter(r => !r.approved).length;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--color-cream)' }}>
            {isEn ? 'Customer Reviews' : 'Müşteri Yorumları'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {isEn
              ? `${approved_count} approved · ${pending_count} pending`
              : `${approved_count} onaylı · ${pending_count} beklemede`}
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-gold shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {isEn ? 'Add Review' : 'Yorum Ekle'}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[['all', isEn ? 'All' : 'Tümü', reviews.length], ['approved', isEn ? 'Approved' : 'Onaylı', approved_count], ['pending', isEn ? 'Pending' : 'Beklemede', pending_count]].map(([val, lbl, cnt]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150"
            style={filter === val
              ? { background: 'rgba(200,149,42,0.18)', color: 'var(--color-gold)', border: '1px solid rgba(200,149,42,0.3)' }
              : { background: 'transparent', color: 'var(--color-muted)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {lbl} <span style={{ color: 'var(--color-dimmed)' }}>{cnt}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isEn ? 'Author' : 'Yazar'}</th>
              <th>{isEn ? 'Rating' : 'Puan'}</th>
              <th>{isEn ? 'Content' : 'İçerik'}</th>
              <th>{isEn ? 'Status' : 'Durum'}</th>
              <th className="text-right">{isEn ? 'Actions' : 'İşlemler'}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-sm" style={{ color: 'var(--color-dimmed)' }}>
                {isEn ? 'No reviews.' : 'Yorum yok.'}
              </td></tr>
            )}
            {filtered.map((rv) => (
              <tr key={rv.id}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: 'rgba(27,107,58,0.25)', color: '#5dc87e' }}
                    >
                      {rv.author?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="font-semibold text-sm" style={{ color: 'var(--color-cream)' }}>{rv.author}</span>
                  </div>
                </td>
                <td><Stars n={rv.rating} /></td>
                <td>
                  <p className="text-sm max-w-xs line-clamp-2" style={{ color: 'var(--color-muted)' }}>{rv.contentTr}</p>
                </td>
                <td>
                  <button
                    onClick={() => toggle(rv)}
                    disabled={saving[rv.id]}
                    className="badge transition-all"
                    style={rv.approved
                      ? {}
                      : { borderColor: 'rgba(200,149,42,0.3)', background: 'rgba(200,149,42,0.08)', color: 'var(--color-gold)' }
                    }
                  >
                    {saving[rv.id] ? '…' : rv.approved ? (isEn ? 'Approved' : 'Onaylı') : (isEn ? 'Pending' : 'Beklemede')}
                  </button>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(rv)}
                      className="p-1.5 rounded-lg"
                      style={{ color: 'var(--color-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => del(rv.id)}
                      className="p-1.5 rounded-lg"
                      style={{ color: '#f07070', background: 'rgba(180,40,40,0.08)', border: '1px solid rgba(180,40,40,0.2)' }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(7,7,7,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'var(--shadow-lifted)' }}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="font-display text-lg font-bold" style={{ color: 'var(--color-cream)' }}>
                {editing ? (isEn ? 'Edit Review' : 'Yorumu Düzenle') : (isEn ? 'Add Review' : 'Yorum Ekle')}
              </h2>
              <button onClick={() => setModal(false)} style={{ color: 'var(--color-muted)' }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              {formError && <div className="alert alert-error">{formError}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="input-label">{isEn ? 'Author' : 'Yazar'}</label>
                  <input required className="input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="input-label">{isEn ? 'Rating' : 'Puan'}</label>
                  <select className="input" value={rating} onChange={(e) => setRating(+e.target.value)}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="input-label">{isEn ? 'Content (TR)' : 'İçerik (TR)'}</label>
                <textarea rows={3} required className="input resize-none" value={contentTr} onChange={(e) => setContentTr(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="input-label">{isEn ? 'Content (EN)' : 'İçerik (EN)'}</label>
                <textarea rows={3} className="input resize-none" value={contentEn} onChange={(e) => setContentEn(e.target.value)} />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} className="w-4 h-4" style={{ accentColor: 'var(--color-gold)' }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-cream)' }}>
                  {isEn ? 'Approved & visible on website' : 'Onaylı & sitede görüntülensin'}
                </span>
              </label>
            </form>
            <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setModal(false)} className="btn btn-ghost">{isEn ? 'Cancel' : 'İptal'}</button>
              <button onClick={submit} disabled={formSaving} className="btn btn-gold">
                {formSaving ? <Spinner /> : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
                {isEn ? 'Save' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
