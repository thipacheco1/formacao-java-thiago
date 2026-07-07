import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Calendar, ArrowLeft, Eye, EyeOff } from 'lucide-react';

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
  
  // Track user to reset
  const [userToReset, setUserToReset] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  const getStoredUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
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
            color: 65280, // Green
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
    } catch (err) {
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
    } catch (err) {
      console.error("Failed to send email notification:", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      setError('E-mail ou senha incorretos.');
      return;
    }

    onLoginSuccess(user);
    handleClose();
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

    const users = getStoredUsers();
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      setError('Este e-mail já está cadastrado.');
      return;
    }

    const newUser = {
      name,
      age: parseInt(age, 10),
      email,
      phone,
      password
    };

    users.push(newUser);
    saveUsers(users);

    // Notify owner via Webhook and Email
    await sendWebhookNotification(newUser);
    await sendEmailNotification(newUser);

    onLoginSuccess(newUser);
    setSuccess('Cadastro realizado com sucesso!');
    setTimeout(() => {
      handleClose();
    }, 1000);
  };

  const handleRecover = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !phone) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.phone === phone);

    if (!user) {
      setError('E-mail ou Telefone não correspondem a nenhuma conta ativa.');
      return;
    }

    setUserToReset(user);
    setView('reset-password');
  };

  const handleResetPassword = (e) => {
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
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <button className="auth-close-btn" onClick={handleClose} title="Fechar">
          <X size={20} />
        </button>

        {view === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <h2 className="auth-title">Acessar Plataforma</h2>
            <p className="auth-subtitle">Faça login para salvar e sincronizar seu progresso de estudos.</p>

            {error && <div className="auth-alert error">{error}</div>}
            
            <div className="input-group">
              <label htmlFor="login-email">E-mail</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="login-email" 
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
                  placeholder="******" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">Entrar</button>

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

            <div className="auth-divider">ou</div>

            <button type="button" className="auth-visitor-btn" onClick={handleClose}>
              Entrar como Visitante
            </button>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <h2 className="auth-title">Criar Conta</h2>
            <p className="auth-subtitle">Crie seu perfil e salve seu progresso nas aulas de Java.</p>

            {error && <div className="auth-alert error">{error}</div>}
            {success && <div className="auth-alert success">{success}</div>}

            <div className="input-group">
              <label htmlFor="reg-name">Nome Completo</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  id="reg-name" 
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
                  placeholder="Crie uma senha forte" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
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
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="auth-title thin">Recuperar Senha</h2>
            </div>
            <p className="auth-subtitle">Confirme o seu E-mail e o número de Telefone cadastrados para redefinir sua senha.</p>

            {error && <div className="auth-alert error">{error}</div>}

            <div className="input-group">
              <label htmlFor="rec-email">E-mail Cadastrado</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="rec-email" 
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
            <h2 className="auth-title">Nova Senha</h2>
            <p className="auth-subtitle">Defina a sua nova senha de acesso.</p>

            {error && <div className="auth-alert error">{error}</div>}
            {success && <div className="auth-alert success">{success}</div>}

            <div className="input-group">
              <label htmlFor="reset-pass">Nova Senha</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reset-pass" 
                  placeholder="Nova senha" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
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
  );
};

export default AuthModal;
