import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { X, Printer, Award, ShieldCheck } from 'lucide-react';
import { COURSE_TOTAL_LESSONS } from '../data/coursePlan';

const CERTIFICATE_NAMESPACE = 'java-backend-arquitetura:v1';
const formatCertificateDate = () => new Date().toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

const normalizeCodePart = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9]/g, '')
  .toUpperCase();

const generateVerificationCode = (identity, recipientName) => {
  const recipientSeed = normalizeCodePart(recipientName || 'ALUNO')
    .slice(0, 4)
    .padEnd(4, 'X');
  const source = `${CERTIFICATE_NAMESPACE}:${normalizeCodePart(identity || recipientName || 'ALUNO')}`;
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  const hashSeed = (hash >>> 0).toString(36).toUpperCase().padStart(7, '0');
  return `JAVA-${recipientSeed}-${hashSeed}`;
};

const CertificateModal = ({ isOpen, onClose, currentUser, isPreviewMode = false }) => {
  const [studentName, setStudentName] = useState('');
  const [currentDate, setCurrentDate] = useState(formatCertificateDate);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  
  // Set default name from logged-in user or localStorage, default to placeholder
  useEffect(() => {
    if (currentUser && currentUser.name) {
      setStudentName(currentUser.name);
    } else {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.name) {
            setStudentName(parsed.name);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setStudentName(isPreviewMode ? 'Nome do Aluno' : '');
    }
  }, [currentUser, isOpen, isPreviewMode]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocusedElement = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(dialogRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      ));

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setCurrentDate(formatCertificateDate());
  }, [isOpen]);

  const verificationIdentity = isPreviewMode
    ? studentName
    : currentUser?.email || currentUser?.id || studentName;
  const verificationCode = useMemo(
    () => generateVerificationCode(verificationIdentity, studentName),
    [verificationIdentity, studentName]
  );

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleAddToLinkedIn = () => {
    const courseName = encodeURIComponent('Engenheiro Java Backend & Arquiteto de Sistemas');
    const orgName = encodeURIComponent('Formação Java Backend — Thiago Rodrigues');
    const certUrl = encodeURIComponent(`https://formacao-java.vercel.app/validar?codigo=${verificationCode}`);
    const certId = encodeURIComponent(verificationCode);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${courseName}&organizationName=${orgName}&certUrl=${certUrl}&certId=${certId}&issueYear=${year}&issueMonth=${month}`;
    window.open(url, '_blank');
  };

  const handleSharePost = () => {
    const shareText = encodeURIComponent(
      `Conquista desbloqueada! 🎉 Acabei de concluir a Formação Java Backend & Arquiteto de Sistemas ministrada pelo instrutor Thiago Rodrigues. \n\nForam 500 horas de muito conteúdo prático abrangendo Java Core, SOLID, Design Patterns, Spring Boot APIs, banco de dados relacional, testes de integração com Testcontainers, segurança, DevOps com Docker e Kubernetes, mensageria com Kafka e modelagem com DDD.\n\nMais um grande passo rumo à especialização técnica! 🚀👨‍💻\n\nConfira a formação de forma gratuita em: https://formacao-java.vercel.app/`
    );
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="certificate-modal-overlay" role="presentation">
      <div
        ref={dialogRef}
        className="certificate-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        
        {/* Controls header */}
        <div className="certificate-modal-header no-print">
          <div className="modal-header-left">
            <Award className="header-icon" size={24} aria-hidden="true" />
            <div>
              <h3 id={titleId}>{isPreviewMode ? 'Visualizar Modelo de Certificado' : 'Seu Certificado Conquistado!'}</h3>
              <p id={descriptionId} className="subtitle">
                {isPreviewMode 
                  ? 'Demonstração de como ficará o certificado após concluir o curso.' 
                  : 'Parabéns pela conclusão de todas as etapas da formação!'}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Fechar certificado"
            title="Fechar certificado"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Customization input */}
        <div className="certificate-customizer no-print">
          <div className="input-group">
            <label htmlFor="student-name-input">Nome Completo do Aluno:</label>
            <input 
              id="student-name-input"
              type="text" 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)} 
              placeholder="Digite seu nome exatamente como quer no certificado"
              maxLength={60}
              autoComplete="name"
              readOnly={!isPreviewMode}
              aria-readonly={!isPreviewMode}
            />
          </div>
          
          <div className="certificate-actions-row">
            <button type="button" className="print-action-btn" onClick={handlePrint}>
              <Printer size={18} aria-hidden="true" />
              <span>Imprimir / Salvar como PDF</span>
            </button>
            <button type="button" className="linkedin-action-btn outline" onClick={handleAddToLinkedIn} title="Adicionar certificado ao seu perfil do LinkedIn">
              <Award size={18} aria-hidden="true" />
              <span>Adicionar ao LinkedIn</span>
            </button>
            <button type="button" className="linkedin-action-btn fill" onClick={handleSharePost} title="Compartilhar conquista na sua timeline do LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>Compartilhar Conquista</span>
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div className="certificate-print-wrapper" role="document" aria-label={`Certificado de conclusão de ${studentName || 'Nome do Aluno'}`}>
          <div className="certificate-sheet">
            <div className="certificate-frame">
              <div className="certificate-inner-frame">
                
                {/* Decorative corners */}
                <div className="cert-corner top-left" aria-hidden="true"></div>
                <div className="cert-corner top-right" aria-hidden="true"></div>
                <div className="cert-corner bottom-left" aria-hidden="true"></div>
                <div className="cert-corner bottom-right" aria-hidden="true"></div>

                {/* Certificate Content */}
                <div className="certificate-content">
                  
                  {/* Top Brand Header */}
                  <div className="cert-header">
                    <span className="cert-brand">FORMAÇÃO JAVA BACKEND & ARQUITETURA</span>
                    <h1 className="cert-main-title">Certificado de Conclusão</h1>
                    <div className="divider-line">
                      <span className="divider-diamond"></span>
                    </div>
                  </div>

                  {/* Certifies That... */}
                  <div className="cert-body">
                    <p className="cert-lead">Certificamos, para os devidos fins de direito, que o profissional</p>
                    
                    <h2 className="cert-recipient-name">
                      {studentName || 'Nome do Aluno'}
                    </h2>
                    
                    <p className="cert-description">
                      concluiu com êxito e aproveitamento máximo a formação avançada de especialização profissional de
                    </p>
                    
                    <h3 className="cert-course-name">
                      Engenheiro Java Backend & Arquiteto de Sistemas
                    </h3>
                    
                    <p className="cert-details">
                      Uma trilha profunda de estudos com <strong>{COURSE_TOTAL_LESSONS} aulas teóricas e práticas</strong>, cobrindo todo o ecossistema moderno:
                      lógica aplicada, Java Core (JVM, Stack/Heap, Garbage Collector, Memory Allocation), Orientação a Objetos, Coleções Avançadas, 
                      SOLID, Design Patterns, Testes de Integração e TDD, SQL Profundo, JPA/Hibernate, Spring Boot REST APIs, Segurança (JWT/Spring Security),
                      DevOps com Docker & Kubernetes, Observabilidade (Grafana/Prometheus), Mensageria (Kafka/RabbitMQ) e Modelagem com Domain-Driven Design (DDD).
                    </p>
                  </div>

                  {/* Footer with Signatures, Date and Verification */}
                  <div className="cert-footer">
                    <div className="footer-col date-col">
                      <span className="footer-lbl">Emissão</span>
                      <span className="footer-val date-val">{currentDate}</span>
                      <span className="footer-lbl mt-2">Carga Horária</span>
                      <span className="footer-val">500 Horas Aula</span>
                    </div>

                    <div className="footer-col badge-col">
                      <div className="cert-seal-badge">
                        <Award size={40} className="seal-icon" aria-hidden="true" />
                        <div className="badge-text-circular">CONCLUÍDO</div>
                      </div>
                    </div>

                    <div className="footer-col signature-col">
                      <div className="signature-line">
                        <span className="signature-script">Thiago Pacheco</span>
                      </div>
                      <span className="instructor-title">Thiago Pacheco</span>
                      <span className="instructor-subtitle">Mentor & Instrutor Principal</span>
                    </div>
                  </div>

                  {/* Certificate Verification Code */}
                  <div className="cert-verification">
                    <span className="verification-text">
                      Código de Autenticidade: <strong>{verificationCode}</strong>
                    </span>
                    <span className="verification-text">
                      Verificável em formacao-java.vercel.app/validar
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer for mockup view */}
        {isPreviewMode && (
          <div className="certificate-preview-warning no-print">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Este é um <strong>modelo de pré-visualização</strong> para testes de layout e impressão antes da publicação final.</span>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default CertificateModal;
