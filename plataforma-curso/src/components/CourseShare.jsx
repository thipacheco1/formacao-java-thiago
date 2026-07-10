import React, { useState } from 'react';
import { Check, Copy, Mail, Share2 } from 'lucide-react';

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const SHARE_TITLE = 'Curso gratuito de Java Backend — do zero à arquitetura';
const SHARE_TEXT = 'Conheça esta formação gratuita e completa de Java Backend, com uma trilha progressiva do primeiro código à arquitetura de sistemas.';

const getCanonicalUrl = () => (
  document.querySelector('link[rel="canonical"]')?.href
  || `${window.location.origin}/`
);

const buildTrackedUrl = (source) => {
  const url = new URL(getCanonicalUrl());
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', 'organic_social');
  url.searchParams.set('utm_campaign', 'formacao_java_backend');
  url.searchParams.set('utm_content', 'pagina_inicial');
  return url.toString();
};

const CourseShare = () => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = buildTrackedUrl('copy_link');
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt('Copie o link do curso:', url);
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({
        title: SHARE_TITLE,
        text: SHARE_TEXT,
        url: buildTrackedUrl('web_share')
      });
    } catch {
      // Closing the native share dialog is an expected action.
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT}\n\n${buildTrackedUrl('whatsapp')}`)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildTrackedUrl('linkedin'))}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${buildTrackedUrl('email')}`)}`;

  return (
    <aside className="course-share-strip" aria-label="Compartilhar formação gratuita">
      <div className="course-share-copy">
        <span className="course-share-icon" aria-hidden="true"><Share2 size={18} /></span>
        <div>
          <strong>Ajude este curso gratuito a chegar mais longe</strong>
          <span>Compartilhe com quem também quer evoluir em Java Backend.</span>
        </div>
      </div>

      <div className="course-share-actions">
        <a className="share-channel whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
          <WhatsAppIcon /> WhatsApp
        </a>
        <a className="share-channel" href={linkedInUrl} target="_blank" rel="noreferrer">
          <LinkedInIcon /> LinkedIn
        </a>
        <a className="share-channel share-email" href={emailUrl}>
          <Mail size={15} /> E-mail
        </a>
        <button type="button" className="share-channel" onClick={copyLink}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copiado' : 'Copiar link'}
        </button>
        <button type="button" className="share-main-btn" onClick={nativeShare}>
          <Share2 size={15} /> Compartilhar
        </button>
      </div>
    </aside>
  );
};

export default CourseShare;
