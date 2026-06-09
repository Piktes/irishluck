'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const Spinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export default function AdminMenuPage() {
  const { lang = 'tr' } = useParams();
  const isEn = lang === 'en';

  const [pdfUrl,    setPdfUrl]    = useState('');
  const [descTr,    setDescTr]    = useState('');
  const [descEn,    setDescEn]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState('');
  const [error,     setError]     = useState('');

  useEffect(() => {
    fetch('/api/menu').then(r => r.ok ? r.json() : null).then(d => {
      if (d) { setPdfUrl(d.pdfUrl || ''); setDescTr(d.descriptionTr || ''); setDescEn(d.descriptionEn || ''); }
      setLoading(false);
    });
  }, []);

  const uploadPdf = async (file) => {
    if (!file) return;
    setUploading(true); setError(''); setSuccess('');
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('type', 'menu');
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setPdfUrl(d.url);
    } catch (e) { setError(isEn ? 'PDF upload failed.' : 'PDF yüklenemedi.'); }
    finally { setUploading(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const r = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrl, descriptionTr: descTr, descriptionEn: descEn }),
      });
      if (!r.ok) throw new Error((await r.json()).error || 'Error');
      setSuccess(isEn ? 'Menu updated successfully.' : 'Menü başarıyla güncellendi.');
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center" style={{ color: 'var(--color-gold)' }}>
      <Spinner />
    </div>
  );

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--color-cream)' }}>
          {isEn ? 'Menu PDF' : 'Menü PDF'}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
          {isEn ? 'Upload a new menu PDF and update descriptions shown on the website.' : 'Yeni menü PDF yükleyin ve sitede gösterilen açıklamaları güncelleyin.'}
        </p>
      </div>

      <form onSubmit={save} className="space-y-6">
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* PDF Upload */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(200,149,42,0.1)', border: '1px solid rgba(200,149,42,0.2)' }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-gold)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>

          <h2 className="font-display font-bold text-base mb-1" style={{ color: 'var(--color-cream)' }}>
            {isEn ? 'PDF File' : 'PDF Dosyası'}
          </h2>

          {pdfUrl ? (
            <div
              className="flex items-center gap-3 mt-3 p-3 rounded-xl"
              style={{ background: 'rgba(27,107,58,0.1)', border: '1px solid rgba(27,107,58,0.2)' }}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#5dc87e' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm font-medium flex-1 truncate" style={{ color: 'var(--color-cream)' }}>{pdfUrl}</span>
              <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold" style={{ color: 'var(--color-gold)' }}>
                {isEn ? 'View' : 'Görüntüle'}
              </a>
            </div>
          ) : (
            <p className="text-sm mt-2" style={{ color: 'var(--color-dimmed)' }}>
              {isEn ? 'No PDF uploaded yet.' : 'Henüz PDF yüklenmedi.'}
            </p>
          )}

          <div className="mt-4">
            <label className="btn btn-ghost cursor-pointer inline-flex">
              {uploading ? <Spinner /> : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              )}
              {uploading ? (isEn ? 'Uploading…' : 'Yükleniyor…') : (isEn ? 'Upload New PDF' : 'Yeni PDF Yükle')}
              <input type="file" accept="application/pdf" className="hidden" disabled={uploading} onChange={(e) => uploadPdf(e.target.files[0])} />
            </label>
          </div>
        </div>

        {/* Descriptions */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h2 className="font-display font-bold text-base" style={{ color: 'var(--color-cream)' }}>
            {isEn ? 'Menu Description' : 'Menü Açıklaması'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {isEn ? 'Short description shown below the menu section heading.' : 'Menü bölüm başlığının altında gösterilen kısa açıklama.'}
          </p>

          <div className="space-y-1.5">
            <label className="input-label">{isEn ? 'Description (TR)' : 'Açıklama (TR)'}</label>
            <textarea
              rows={4}
              className="input resize-none"
              value={descTr}
              onChange={(e) => setDescTr(e.target.value)}
              placeholder={isEn ? 'Turkish description…' : 'Türkçe açıklama…'}
            />
          </div>
          <div className="space-y-1.5">
            <label className="input-label">{isEn ? 'Description (EN)' : 'Açıklama (EN)'}</label>
            <textarea
              rows={4}
              className="input resize-none"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              placeholder="English description…"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving || uploading} className="btn btn-gold">
            {saving ? <Spinner /> : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {isEn ? 'Save Changes' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
