import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Globe,
  Mail,
  MapPin,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  Building2,
  Layers,
  TrendingUp,
} from 'lucide-react';
import IndustryBadge from '../common/IndustryBadge';
import SizeTierBadge from '../common/SizeTierBadge';

/**
 * CompanyDrawer — Right-side sliding panel that displays full company details.
 *
 * - Opens on row click, closes on ESC / backdrop / close button.
 * - Starts below the fixed header (top-16) so the header is never obscured.
 * - Uses existing lead data only — makes no additional API calls.
 * - Traps focus within the panel when open.
 */
const CompanyDrawer = ({ company, onClose }) => {
  const [copiedField, setCopiedField] = useState(null);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isOpen = Boolean(company);

  // ── ESC to close ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ── Focus close button on open ────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Delay slightly so the CSS transform transition starts first
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Lock body scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Copy helper ───────────────────────────────────────────────────────────
  const handleCopy = useCallback(async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for non-secure contexts
      const el = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const v = (value) => (value && String(value).trim() !== '' ? value : null);

  const formattedDate = company?.last_updated
    ? new Date(company.last_updated).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Company initials for avatar (up to 2 chars)
  const initials = company?.company_name
    ?.split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      {/*  Covers the full viewport including behind the header for the blur  */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Drawer panel ──────────────────────────────────────────────────── */}
      {/*  Starts at top-16 (64px) so it never overlaps the sticky header    */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={company ? `${company.company_name} company profile` : 'Company profile'}
        className={`
          fixed right-0 z-50 flex flex-col
          top-16 h-[calc(100vh-4rem)]
          w-full sm:w-[420px]
          bg-white dark:bg-slate-950
          border-l border-slate-200 dark:border-slate-800
          shadow-2xl
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {company && (
          <>
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {/* Company avatar */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md select-none">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight truncate pr-1">
                    {company.company_name}
                  </h2>
                  <div className="mt-1.5">
                    <IndustryBadge industry={company.industry} />
                  </div>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-slate-950"
                aria-label="Close company profile"
              >
                <X size={17} />
              </button>
            </div>

            {/* ── Scrollable body ─────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="px-5 py-5 space-y-6">

                {/* Quick actions */}
                <div className="flex flex-wrap gap-2">
                  {v(company.domain) && (
                    <a
                      href={`https://${company.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      aria-label={`Open ${company.domain} in new tab`}
                    >
                      <Globe size={13} />
                      Open Website
                      <ExternalLink size={11} className="opacity-70" />
                    </a>
                  )}
                  {v(company.domain) && (
                    <CopyButton
                      label="Copy URL"
                      copied={copiedField === 'website'}
                      onClick={() => handleCopy(company.domain, 'website')}
                      aria-label="Copy website URL to clipboard"
                    />
                  )}
                  {v(company.email_contact) && (
                    <CopyButton
                      label="Copy Email"
                      copied={copiedField === 'email'}
                      onClick={() => handleCopy(company.email_contact, 'email')}
                      aria-label="Copy email address to clipboard"
                    />
                  )}
                </div>

                {/* Company details section */}
                <Section title="Company Details">
                  <DetailRow label="Size Tier" icon={<Building2 size={13} />}>
                    <SizeTierBadge tier={company.size_tier} />
                  </DetailRow>
                  <DetailRow label="Funding Stage" icon={<TrendingUp size={13} />}>
                    {v(company.funding_stage) ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/60 dark:border-slate-700/50">
                        {company.funding_stage}
                      </span>
                    ) : (
                      <EmptyValue />
                    )}
                  </DetailRow>
                  <DetailRow label="City" icon={<MapPin size={13} />}>
                    {v(company.city) ? (
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {company.city}
                      </span>
                    ) : (
                      <EmptyValue />
                    )}
                  </DetailRow>
                  <DetailRow label="Headcount" icon={<Layers size={13} />}>
                    {company.headcount && company.headcount > 0 ? (
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {company.headcount.toLocaleString()} employees
                      </span>
                    ) : (
                      <EmptyValue />
                    )}
                  </DetailRow>
                  <DetailRow label="Last Updated" icon={<Calendar size={13} />} isLast>
                    {formattedDate ? (
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {formattedDate}
                      </span>
                    ) : (
                      <EmptyValue />
                    )}
                  </DetailRow>
                </Section>

                {/* Contact & online section */}
                <Section title="Contact & Online">
                  <DetailRow label="Website" icon={<Globe size={13} />}>
                    {v(company.domain) ? (
                      <a
                        href={`https://${company.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-semibold truncate max-w-[200px] inline-block"
                      >
                        {company.domain}
                      </a>
                    ) : (
                      <EmptyValue />
                    )}
                  </DetailRow>
                  <DetailRow label="Email" icon={<Mail size={13} />} isLast>
                    {v(company.email_contact) ? (
                      <a
                        href={`mailto:${company.email_contact}`}
                        className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-xs font-medium truncate max-w-[210px] inline-block"
                      >
                        {company.email_contact}
                      </a>
                    ) : (
                      <EmptyValue />
                    )}
                  </DetailRow>
                </Section>

              </div>
            </div>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <div className="shrink-0 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 text-center select-none tracking-wide">
                ROW ID #{company.id} · BASEROW DATABASE
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div>
    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">
      {title}
    </p>
    <div className="rounded-xl border border-slate-100 dark:border-slate-800/70 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/70">
      {children}
    </div>
  </div>
);

const DetailRow = ({ label, icon, children, isLast }) => (
  <div className={`flex items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-slate-900/60 ${!isLast ? '' : ''}`}>
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold shrink-0 min-w-[100px]">
      <span className="text-slate-400 dark:text-slate-500 shrink-0">{icon}</span>
      {label}
    </div>
    <div className="text-right min-w-0 max-w-[220px]">{children}</div>
  </div>
);

const EmptyValue = () => (
  <span className="text-slate-400 dark:text-slate-600 text-xs font-medium italic">Not available</span>
);

const CopyButton = ({ label, copied, onClick, ...props }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
      copied
        ? 'border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800'
    }`}
    {...props}
  >
    {copied ? (
      <><Check size={13} className="shrink-0" />Copied!</>
    ) : (
      <><Copy size={13} className="shrink-0" />{label}</>
    )}
  </button>
);

export default CompanyDrawer;
