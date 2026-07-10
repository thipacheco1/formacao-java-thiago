import React, { useState } from 'react';
import { Check, Copy, Linkedin as LinkedIn, Mail, Share2 } from 'lucide-react';

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
          WhatsApp
        </a>
        <a className="share-channel" href={linkedInUrl} target="_blank" rel="noreferrer">
          <LinkedIn size={15} /> LinkedIn
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
