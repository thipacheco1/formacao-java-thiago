module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, age, email, phone } = req.body;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return res.status(500).json({ error: 'Resend API key not configured on server (RESEND_API_KEY)' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Default sender for Resend free testing accounts
        to: 'thipacheco1@gmail.com',
        subject: '🚀 Novo Aluno Cadastrado na Plataforma!',
        html: `
          <h3>Um novo aluno acaba de se cadastrar na plataforma:</h3>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Idade:</strong> ${age} anos</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone}</p>
          <br/>
          <p>Este e-mail foi gerado automaticamente pela plataforma Formação Java Thiago.</p>
        `
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
