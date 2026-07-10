import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Calendar, ArrowLeft, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import BrandMark from './BrandMark';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'recover' | 'reset-password'
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track user to reset
  const [userToReset, setUserToReset] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setError('');
    setSuccess('');
    setView('login');
    setShowPassword(false);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setUserToReset(null);
    onClose();
  };

  const getStoredUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const toSessionUser = (user) => {
    if (!user) return user;
    const { password: storedPassword, ...sessionUser } = user;
    void storedPassword;
    return sessionUser;
  };

  const sendWebhookNotification = async (userData) => {
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.log("Discord Webhook not configured. New user data:", userData);
      return;
    }
    
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: "🚀 Novo Aluno Cadastrado na Plataforma!",
            color: 3892177, // Azul mineral da identidade da plataforma
            fields: [
              { name: "Nome", value: userData.name, inline: true },
              { name: "Idade", value: String(userData.age) + " anos", inline: true },
              { name: "E-mail", value: userData.email, inline: false },
              { name: "Telefone", value: userData.phone, inline: true }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch {
      console.error("Failed to send webhook notification:", err);
    }
  };

  const sendEmailNotification = async (userData) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          age: userData.age,
          email: userData.email,
          phone: userData.phone
        })
      });
    } catch {
      console.error("Failed to send email notification:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status >= 500) {
          throw new Error(data.error || 'API_UNAVAILABLE');
        }
        setError(data.error || 'Erro ao realizar login.');
        return;
      }

      onLoginSuccess(data.user);
      handleClose();
    } catch {
      // Fallback to local storage
      const users = getStoredUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user || user.password !== password) {
        setError(import.meta.env.DEV
          ? 'A API local não está disponível. Inicie o projeto com npm run dev e tente novamente.'
          : 'E-mail ou senha incorretos.');
        return;
      }

      onLoginSuccess(toSessionUser(user));
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !age || !email || !phone || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    const newUser = {
      name,
      age: parseInt(age, 10),
      email,
      phone,
      password
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();

      if (res.ok) {
        onLoginSuccess(data.user);
        setSuccess('Cadastro realizado com sucesso!');
        setTimeout(() => {
          handleClose();
        }, 1000);
        return;
      } else {
        if (data.error && data.error.includes('Database environment variables not configured')) {
          throw new Error('KV_NOT_CONFIGURED');
        }
        setError(data.error || 'Erro ao realizar cadastro.');
        return;
      }
    } catch {
      // Fallback to local storage
      const users = getStoredUsers();
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (emailExists) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      users.push(newUser);
      saveUsers(users);

      // Notify owner via Webhook and Email in background
      await sendWebhookNotification(newUser);
      await sendEmailNotification(newUser);

      onLoginSuccess(toSessionUser(newUser));
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => {
        handleClose();
      }, 1000);
    }
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !phone) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const users = await res.json();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.phone === phone);

        if (!user) {
          setError('E-mail ou Telefone não correspondem a nenhuma conta ativa.');
          return;
        }

        setUserToReset(user);
        setView('reset-password');
        return;
      } else {
        const data = await res.json();
        if (data.error && data.error.includes('Database environment variables not configured')) {
          throw new Error('KV_NOT_CONFIGURED');
        }
        setError(data.error || 'Erro de conexão.');
      }
    } catch {
      // Fallback to local storage
      const users = getStoredUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.phone === phone);

      if (!user) {
        setError('E-mail ou Telefone não correspondem a nenhuma conta ativa.');
        return;
      }

      setUserToReset(user);
      setView('reset-password');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userToReset.email, password: newPassword })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Senha redefinida com sucesso!');
        setTimeout(() => {
          setSuccess('');
          setView('login');
          setPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setUserToReset(null);
        }, 1500);
        return;
      } else {
        if (data.error && data.error.includes('Database environment variables not configured')) {
          throw new Error('KV_NOT_CONFIGURED');
        }
        setError(data.error || 'Erro ao redefinir senha.');
      }
    } catch {
      // Fallback to local storage
      const users = getStoredUsers();
      const updatedUsers = users.map(u => {
        if (u.email.toLowerCase() === userToReset.email.toLowerCase()) {
          return { ...u, password: newPassword };
        }
        return u;
      });

      saveUsers(updatedUsers);
      setSuccess('Senha redefinida com sucesso!');
      setTimeout(() => {
        setSuccess('');
        setView('login');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setUserToReset(null);
      }, 1500);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <aside className="auth-brand-panel">
          <div className="auth-brand-logo">
            <BrandMark size={46} decorative />
            <span>Java Backend</span>
          </div>
          <div className="auth-brand-message">
            <span className="auth-brand-eyebrow">Sua jornada continua aqui</span>
            <h3>Estude com clareza, avance com consistência.</h3>
            <p>Acompanhe sua evolução em uma trilha construída do primeiro código à arquitetura.</p>
          </div>
          <div className="auth-brand-benefits">
            <span><CheckCircle2 size={15} /> Progresso salvo por aula</span>
            <span><CheckCircle2 size={15} /> Jornada organizada em fases</span>
            <span><CheckCircle2 size={15} /> Acesso em qualquer dispositivo</span>
          </div>
          <div className="auth-brand-security">
            <ShieldCheck size={16} />
            <span>Seus dados de estudo permanecem vinculados ao seu perfil.</span>
          </div>
        </aside>

        <div className="auth-form-panel">
          <button className="auth-close-btn" onClick={handleClose} title="Fechar" aria-label="Fechar autenticação">
            <X size={20} />
          </button>

        {view === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <span className="auth-form-eyebrow">Bem-vindo de volta</span>
            <h2 className="auth-title" id="auth-modal-title">Acessar plataforma</h2>
            <p className="auth-subtitle">Faça login para salvar e sincronizar seu progresso de estudos.</p>

            {error && <div className="auth-alert error" role="alert">{error}</div>}
            
            <div className="input-group">
              <label htmlFor="login-email">E-mail</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="login-email" 
                  name="email"
                  autoComplete="email"
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-label-row">
                <label htmlFor="login-pass">Senha</label>
                <button 
                  type="button" 
                  className="auth-link-btn" 
                  onClick={() => setView('recover')}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="login-pass" 
                  name="password"
                  autoComplete="current-password"
                  placeholder="******" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Conectando...' : 'Entrar'}
            </button>

            <div className="auth-footer-links">
              <span>Novo por aqui? </span>
              <button 
                type="button" 
                className="auth-link-btn highlight" 
                onClick={() => { setView('register'); setError(''); }}
              >
                Crie sua conta
              </button>
            </div>

          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <span className="auth-form-eyebrow">Comece sua jornada</span>
            <h2 className="auth-title" id="auth-modal-title">Criar conta</h2>
            <p className="auth-subtitle">Crie seu perfil e salve seu progresso nas aulas de Java.</p>

            {error && <div className="auth-alert error" role="alert">{error}</div>}
            {success && <div className="auth-alert success" role="status">{success}</div>}

            <div className="input-group">
              <label htmlFor="reg-name">Nome Completo</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  id="reg-name" 
                  name="name"
                  autoComplete="name"
                  placeholder="Seu Nome" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="reg-age">Idade</label>
                <div className="input-wrapper">
                  <Calendar size={18} className="input-icon" />
                  <input 
                    type="number" 
                    id="reg-age" 
                    name="age"
                    placeholder="18" 
                    min="1" 
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="reg-phone">Telefone</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    id="reg-phone" 
                    name="tel"
                    autoComplete="tel"
                    placeholder="(00) 00000-0000" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">E-mail</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="reg-email" 
                  name="email"
                  autoComplete="email"
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reg-pass">Senha (mín. 6 caracteres)</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reg-pass" 
                  name="new-password"
                  autoComplete="new-password"
                  placeholder="Crie uma senha forte" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">Cadastrar e Iniciar</button>

            <div className="auth-footer-links">
              <span>Já tem conta? </span>
              <button 
                type="button" 
                className="auth-link-btn highlight" 
                onClick={() => { setView('login'); setError(''); }}
              >
                Faça login
              </button>
            </div>
          </form>
        )}

        {view === 'recover' && (
          <form onSubmit={handleRecover} className="auth-form">
            <div className="auth-header-row">
              <button 
                type="button" 
                className="back-btn" 
                onClick={() => { setView('login'); setError(''); }}
                title="Voltar ao login"
                aria-label="Voltar ao login"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="auth-title thin" id="auth-modal-title">Recuperar senha</h2>
            </div>
            <p className="auth-subtitle">Confirme o seu E-mail e o número de Telefone cadastrados para redefinir sua senha.</p>

            {error && <div className="auth-alert error" role="alert">{error}</div>}

            <div className="input-group">
              <label htmlFor="rec-email">E-mail Cadastrado</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="rec-email" 
                  name="email"
                  autoComplete="email"
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="rec-phone">Telefone Cadastrado</label>
              <div className="input-wrapper">
                <Phone size={18} className="input-icon" />
                <input 
                  type="tel" 
                  id="rec-phone" 
                  name="tel"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">Confirmar Dados</button>
          </form>
        )}

        {view === 'reset-password' && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <span className="auth-form-eyebrow">Proteja seu acesso</span>
            <h2 className="auth-title" id="auth-modal-title">Nova senha</h2>
            <p className="auth-subtitle">Defina a sua nova senha de acesso.</p>

            {error && <div className="auth-alert error" role="alert">{error}</div>}
            {success && <div className="auth-alert success" role="status">{success}</div>}

            <div className="input-group">
              <label htmlFor="reset-pass">Nova Senha</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reset-pass" 
                  name="new-password"
                  autoComplete="new-password"
                  placeholder="Nova senha" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reset-confirm">Confirmar Nova Senha</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reset-confirm" 
                  name="confirm-password"
                  autoComplete="new-password"
                  placeholder="Confirme a nova senha" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">Salvar Nova Senha</button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
