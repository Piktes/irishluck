'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const Spinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const CATEGORIES = ['atmosphere', 'events', 'food', 'drinks'];

export default function AdminGalleryPage() {
  const { lang = 'tr' } = useParams();
  const isEn = lang === 'en';

  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category,  setCategory]  = useState('atmosphere');
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [filter,    setFilter]    = useState('all');

  const load = () => fetch('/api/gallery').then(r => r.ok ? r.json() : []).then(d => { setItems(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const upload = async (files) => {
    if (!files?.length) return;
    setUploading(true); setError(''); setSuccess('');
    let count = 0;
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData();
        fd.append('file', file); fd.append('type', 'gallery');
        const r = await fetch('/api/upload', { method: 'POST', body: fd });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        const r2 = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: d.url, category }),
        });
        if (r2.ok) count++;
      } catch {}
    }
    await load();
    setSuccess(isEn ? `${count} photo(s) uploaded.` : `${count} fotoğraf yüklendi.`);
    setUploading(false);
  };

  const del = async (id) => {
    if (!confirm(isEn ? 'Delete this photo?' : 'Bu fotoğrafı sil?')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    load();
  };

  const catLabel = (c) => {
    const labels = {
      atmosphere: isEn ? 'Atmosphere' : 'Atmosfer',
      events:     isEn ? 'Events'     : 'Etkinlikler',
      food:       isEn ? 'Food'       : 'Yemek',
      drinks:     isEn ? 'Drinks'     : 'İçecekler',
    };
    return labels[c] || c;
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center" style={{ color: 'var(--color-gold)' }}>
      <Spinner />
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--color-cream)' }}>
          {isEn ? 'Gallery' : 'Galeri'}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
          {isEn ? `${items.length} photos in gallery.` : `Galeride ${items.length} fotoğraf var.`}
        </p>
      </div>

      {/* Upload panel */}
      <div className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h2 className="font-display font-bold text-base" style={{ color: 'var(--color-cream)' }}>
          {isEn ? 'Upload Photos' : 'Fotoğraf Yükle'}
        </h2>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150"
              style={category === c
                ? { background: 'var(--color-green)', color: '#fff', border: '1px solid transparent' }
                : { background: 'transparent', color: 'var(--color-muted)', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              {catLabel(c)}
            </button>
          ))}
        </div>

        <label
          className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl cursor-pointer transition-all duration-200"
          style={{ border: '2px dashed rgba(255,255,255,0.12)', background: uploading ? 'rgba(27,107,58,0.08)' : 'transparent' }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(200,149,42,0.4)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
        >
          {uploading
            ? <><Spinner /><span className="text-sm" style={{ color: 'var(--color-muted)' }}>{isEn ? 'Uploading…' : 'Yükleniyor…'}</span></>
            : <>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-dimmed)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                    {isEn ? 'Click or drag & drop photos' : 'Fotoğrafları tıklayın veya sürükleyin'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-dimmed)' }}>
                    {isEn ? `Category: ${catLabel(category)}` : `Kategori: ${catLabel(category)}`}
                  </p>
                </div>
              </>
          }
          <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={(e) => upload(e.target.files)} />
        </label>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...CATEGORIES].map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150"
            style={filter === c
              ? { background: 'rgba(200,149,42,0.18)', color: 'var(--color-gold)', border: '1px solid rgba(200,149,42,0.3)' }
              : { background: 'transparent', color: 'var(--color-muted)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {c === 'all' ? (isEn ? 'All' : 'Tümü') : catLabel(c)}
            <span className="ml-1.5" style={{ color: 'var(--color-dimmed)' }}>
              {c === 'all' ? items.length : items.filter(i => i.category === c).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--color-dimmed)' }}>
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-sm">{isEn ? 'No photos.' : 'Fotoğraf yok.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--color-dark-200)' }}>
              <img
                src={item.imageUrl}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(to top, rgba(7,7,7,0.8) 0%, transparent 50%)' }}
              >
                <div className="flex justify-end">
                  <button
                    onClick={() => del(item.id)}
                    className="p-1.5 rounded-lg"
                    style={{ background: 'rgba(180,40,40,0.7)', color: '#fff' }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
                <span
                  className="self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ background: 'rgba(0,0,0,0.5)', color: 'var(--color-gold)' }}
                >
                  {catLabel(item.category)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
