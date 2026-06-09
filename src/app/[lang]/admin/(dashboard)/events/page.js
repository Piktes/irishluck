'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const Spinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="input-label">{label}</label>
    {children}
  </div>
);

export default function AdminEventsPage() {
  const { lang = 'tr' } = useParams();
  const isEn = lang === 'en';

  const [events,   setEvents]  = useState([]);
  const [loading,  setLoading] = useState(true);
  const [modal,    setModal]   = useState(false);
  const [editing,  setEditing] = useState(null);

  const [titleTr, setTitleTr]           = useState('');
  const [titleEn, setTitleEn]           = useState('');
  const [date,    setDate]              = useState('');
  const [artist,  setArtist]            = useState('');
  const [image,   setImage]             = useState('');
  const [descTr,  setDescTr]            = useState('');
  const [descEn,  setDescEn]            = useState('');
  const [active,  setActive]            = useState(true);
  const [saving,  setSaving]            = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [error,   setError]             = useState('');

  const load = async () => {
    try {
      const r = await fetch('/api/events');
      if (r.ok) setEvents(await r.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const localNow = () => {
    const d = new Date();
    d.setHours(21, 0, 0, 0);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const openAdd = () => {
    setEditing(null);
    setTitleTr(''); setTitleEn(''); setDate(localNow());
    setArtist(''); setImage(''); setDescTr(''); setDescEn('');
    setActive(true); setError(''); setModal(true);
  };

  const openEdit = (ev) => {
    setEditing(ev);
    setTitleTr(ev.titleTr || ''); setTitleEn(ev.titleEn || '');
    const d = new Date(ev.date);
    setDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    setArtist(ev.artist || ''); setImage(ev.image || '');
    setDescTr(ev.descriptionTr || ''); setDescEn(ev.descriptionEn || '');
    setActive(ev.active); setError(''); setModal(true);
  };

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('type', 'events');
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setImage(d.url);
    } catch (e) {
      setError(isEn ? 'Image upload failed.' : 'Görsel yüklenemedi.');
    } finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const url = editing ? `/api/events/${editing.id}` : '/api/events';
      const r = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleTr, titleEn, date, artist, image, descriptionTr: descTr, descriptionEn: descEn, active }),
      });
      if (!r.ok) throw new Error((await r.json()).error || 'Error');
      setModal(false); load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm(isEn ? 'Delete this event?' : 'Bu etkinliği sil?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center" style={{ color: 'var(--color-gold)' }}>
      <Spinner />
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="admin-page-header flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--color-cream)' }}>
            {isEn ? 'Manage Events' : 'Etkinlikleri Yönet'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {isEn ? 'Update the weekly live music schedule.' : 'Haftalık canlı sahne programını güncelleyin.'}
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-gold shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {isEn ? 'New Event' : 'Yeni Etkinlik'}
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isEn ? 'Date' : 'Tarih'}</th>
              <th>{isEn ? 'Artist' : 'Sanatçı'}</th>
              <th>{isEn ? 'Title' : 'Başlık'}</th>
              <th>{isEn ? 'Status' : 'Durum'}</th>
              <th className="text-right">{isEn ? 'Actions' : 'İşlemler'}</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-sm" style={{ color: 'var(--color-dimmed)' }}>
                {isEn ? 'No events.' : 'Etkinlik yok.'}
              </td></tr>
            )}
            {events.map((ev) => (
              <tr key={ev.id}>
                <td>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-cream)' }}>
                    {new Date(ev.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="block text-xs" style={{ color: 'var(--color-dimmed)' }}>
                    {new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td><span className="font-semibold" style={{ color: 'var(--color-gold)' }}>{ev.artist}</span></td>
                <td>
                  <div className="text-sm font-medium" style={{ color: 'var(--color-cream)' }}>{ev.titleTr}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-dimmed)' }}>{ev.titleEn}</div>
                </td>
                <td>
                  <span
                    className="badge"
                    style={ev.active ? {} : { borderColor: 'rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--color-dimmed)' }}
                  >
                    {ev.active ? (isEn ? 'Active' : 'Aktif') : (isEn ? 'Hidden' : 'Gizli')}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(ev)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--color-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => del(ev.id)}
                      className="p-1.5 rounded-lg transition-colors"
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
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'var(--shadow-lifted)' }}>
            <div className="px-6 py-5 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="font-display text-lg font-bold" style={{ color: 'var(--color-cream)' }}>
                {editing ? (isEn ? 'Edit Event' : 'Etkinliği Düzenle') : (isEn ? 'New Event' : 'Yeni Etkinlik')}
              </h2>
              <button onClick={() => setModal(false)} style={{ color: 'var(--color-muted)' }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {error && <div className="alert alert-error">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={isEn ? 'Artist / Band' : 'Sanatçı / Grup'}>
                  <input required className="input" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Grup Adı" />
                </Field>
                <Field label={isEn ? 'Date & Time' : 'Tarih & Saat'}>
                  <input required type="datetime-local" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={isEn ? 'Title (TR)' : 'Başlık (TR)'}>
                  <input required className="input" value={titleTr} onChange={(e) => setTitleTr(e.target.value)} placeholder="Canlı Müzik Gecesi" />
                </Field>
                <Field label={isEn ? 'Title (EN)' : 'Başlık (EN)'}>
                  <input required className="input" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Live Music Night" />
                </Field>
              </div>
              <Field label={isEn ? 'Cover Image' : 'Kapak Görseli'}>
                <div className="flex gap-3 items-center">
                  <label className="btn btn-ghost text-xs cursor-pointer">
                    {uploading ? <Spinner /> : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    )}
                    {isEn ? 'Upload' : 'Yükle'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files[0])} disabled={uploading} />
                  </label>
                  <input className="input flex-1" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/uploads/events/..." />
                </div>
                {image && <img src={image} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={isEn ? 'Description (TR)' : 'Açıklama (TR)'}>
                  <textarea rows={3} className="input resize-none" value={descTr} onChange={(e) => setDescTr(e.target.value)} />
                </Field>
                <Field label={isEn ? 'Description (EN)' : 'Açıklama (EN)'}>
                  <textarea rows={3} className="input resize-none" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
                </Field>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4" style={{ accentColor: 'var(--color-gold)' }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-cream)' }}>
                  {isEn ? 'Active & visible on website' : 'Aktif & sitede görüntülensin'}
                </span>
              </label>
            </form>
            <div className="px-6 py-4 flex justify-end gap-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setModal(false)} className="btn btn-ghost">{isEn ? 'Cancel' : 'İptal'}</button>
              <button onClick={submit} disabled={saving || uploading} className="btn btn-gold">
                {saving ? <Spinner /> : (
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
