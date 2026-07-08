import React, { useState, useEffect } from 'react';
import { X, Printer, Award, ShieldCheck } from 'lucide-react';

const CertificateModal = ({ isOpen, onClose, currentUser, isPreviewMode = false }) => {
  const [studentName, setStudentName] = useState('');
  
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
      setStudentName('Thiago Pacheco'); // Default placeholder name for preview
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate a mock unique hash code for validation
  const generateVerificationCode = () => {
    const nameSeed = studentName.replace(/\s+/g, '').toUpperCase().slice(0, 4);
    const dateSeed = new Date().getFullYear().toString();
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `JAVA-${nameSeed}-${dateSeed}-${hash}`;
  };

  const verificationCode = generateVerificationCode();
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="certificate-modal-overlay">
      <div className="certificate-modal-container">
        
        {/* Controls header */}
        <div className="certificate-modal-header no-print">
          <div className="modal-header-left">
            <Award className="header-icon" size={24} style={{ color: '#6366f1' }} />
            <div>
              <h3>{isPreviewMode ? 'Visualizar Modelo de Certificado' : 'Seu Certificado Conquistado!'}</h3>
              <p className="subtitle">
                {isPreviewMode 
                  ? 'Demonstração de como ficará o certificado após concluir o curso.' 
                  : 'Parabéns pela conclusão de todas as etapas da formação!'}
              </p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose} title="Fechar modal">
            <X size={20} />
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
            />
          </div>
          
          <button className="print-action-btn" onClick={handlePrint}>
            <Printer size={18} />
            <span>Imprimir / Salvar como PDF</span>
          </button>
        </div>

        {/* Printable Certificate Area */}
        <div className="certificate-print-wrapper">
          <div className="certificate-sheet">
            <div className="certificate-frame">
              <div className="certificate-inner-frame">
                
                {/* Decorative corners */}
                <div className="cert-corner top-left"></div>
                <div className="cert-corner top-right"></div>
                <div className="cert-corner bottom-left"></div>
                <div className="cert-corner bottom-right"></div>

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
                      Uma trilha profunda de estudos contendo mais de <strong>500 aulas teóricas e práticas</strong>, cobrindo todo o ecossistema moderno:
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
                      <div className="cert-gold-badge">
                        <Award size={40} className="gold-icon" />
                        <div className="badge-text-circular">APPROVED</div>
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
                      Verificável em formacao.thiagopacheco.com.br/validar
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
            <ShieldCheck size={16} />
            <span>Este é um <strong>modelo de pré-visualização</strong> para testes de layout e impressão antes da publicação final.</span>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default CertificateModal;
