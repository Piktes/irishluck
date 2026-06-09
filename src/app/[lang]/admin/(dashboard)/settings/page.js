'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const Spinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const FIELDS = [
  { key: 'phone',      labelTr: 'Telefon',       labelEn: 'Phone',          type: 'text',     mono: true,  both: false },
  { key: 'whatsapp',   labelTr: 'WhatsApp',       labelEn: 'WhatsApp',       type: 'text',     mono: true,  both: false },
  { key: 'instagram',  labelTr: 'Instagram',      labelEn: 'Instagram',      type: 'text',     mono: false, both: false },
  { key: 'address',    labelTr: 'Adres',          labelEn: 'Address',        type: 'text',     mono: false, both: true  },
  { key: 'map_url',    labelTr: 'Harita URL',     labelEn: 'Map URL',        type: 'textarea', mono: true,  both: false },
  { key: 'hours_weekdays', labelTr: 'Hafta İçi Saatler', labelEn: 'Weekday Hours', type: 'text', mono: false, both: true },
  { key: 'hours_weekends', labelTr: 'Hafta Sonu Saatler', labelEn: 'Weekend Hours', type: 'text', mono: false, both: true },
  { key: 'about_text', labelTr: 'Hakkımızda Metni', labelEn: 'About Text',   type: 'textarea', mono: false, both: true  },
];

const SectionCard = ({ title, children }) => (
  <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-dark-200)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <h2 className="font-display font-bold text-base" style={{ color: 'var(--color-cream)' }}>{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

export default function AdminSettingsPage() {
  const { lang = 'tr' } = useParams();
  const isEn = lang === 'en';

  const [values,  setValues]  = useState({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch('/api/settings').then(r => r.ok ? r.json() : {}).then(d => {
      const flat = {};
      if (Array.isArray(d)) {
        d.forEach(s => { flat[`${s.key}_tr`] = s.valueTr || ''; flat[`${s.key}_en`] = s.valueEn || ''; });
      }
      setValues(flat); setLoading(false);
    });
  }, []);

  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError(''); setSuccess('');
    try {
      const settings = {};
      Object.entries(values).forEach(([k, v]) => {
        const [key, ...rest] = k.split('_');
        const field = rest.join('_');
        if (!settings[key]) settings[key] = {};
        if (field === 'tr') settings[key].valueTr = v;
        else if (field === 'en') settings[key].valueEn = v;
      });
      const r = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (!r.ok) throw new Error((await r.json()).error || 'Error');
      setSuccess(isEn ? 'Settings saved.' : 'Ayarlar kaydedildi.');
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center" style={{ color: 'var(--color-gold)' }}>
      <Spinner />
    </div>
  );

  const renderField = (f) => {
    const label = isEn ? f.labelEn : f.labelTr;
    if (!f.both) {
      const k = `${f.key}_tr`;
      return (
        <div key={f.key} className="space-y-1.5">
          <label className="input-label">{label}</label>
          {f.type === 'textarea' ? (
            <textarea rows={3} className="input resize-none" style={f.mono ? { fontFamily: 'monospace', fontSize: '0.8rem' } : {}}
              value={values[k] || ''} onChange={(e) => set(k, e.target.value)} />
          ) : (
            <input type="text" className="input" style={f.mono ? { fontFamily: 'monospace' } : {}}
              value={values[k] || ''} onChange={(e) => set(k, e.target.value)} />
          )}
        </div>
      );
    }
    return (
      <div key={f.key} className="space-y-1.5">
        <label className="input-label">{label}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-dimmed)' }}>TR</p>
            {f.type === 'textarea' ? (
              <textarea rows={2} className="input resize-none text-sm" value={values[`${f.key}_tr`] || ''} onChange={(e) => set(`${f.key}_tr`, e.target.value)} />
            ) : (
              <input type="text" className="input text-sm" value={values[`${f.key}_tr`] || ''} onChange={(e) => set(`${f.key}_tr`, e.target.value)} />
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-dimmed)' }}>EN</p>
            {f.type === 'textarea' ? (
              <textarea rows={2} className="input resize-none text-sm" value={values[`${f.key}_en`] || ''} onChange={(e) => set(`${f.key}_en`, e.target.value)} />
            ) : (
              <input type="text" className="input text-sm" value={values[`${f.key}_en`] || ''} onChange={(e) => set(`${f.key}_en`, e.target.value)} />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--color-cream)' }}>
          {isEn ? 'Site Settings' : 'Site Ayarları'}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
          {isEn ? 'Update contact info, opening hours, and other site-wide content.' : 'İletişim bilgilerini, çalışma saatlerini ve site genelindeki içerikleri güncelleyin.'}
        </p>
      </div>

      <form onSubmit={save} className="space-y-6">
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <SectionCard title={isEn ? 'Contact' : 'İletişim'}>
          {FIELDS.filter(f => ['phone','whatsapp','instagram'].includes(f.key)).map(renderField)}
        </SectionCard>

        <SectionCard title={isEn ? 'Location' : 'Konum'}>
          {FIELDS.filter(f => ['address','map_url'].includes(f.key)).map(renderField)}
        </SectionCard>

        <SectionCard title={isEn ? 'Opening Hours' : 'Çalışma Saatleri'}>
          {FIELDS.filter(f => f.key.startsWith('hours')).map(renderField)}
        </SectionCard>

        <SectionCard title={isEn ? 'Content' : 'İçerik'}>
          {FIELDS.filter(f => ['about_text'].includes(f.key)).map(renderField)}
        </SectionCard>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-gold">
            {saving ? <Spinner /> : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {isEn ? 'Save All Settings' : 'Tüm Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
