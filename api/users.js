module.exports = async function handler(req, res) {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return res.status(500).json({ error: 'Database environment variables not configured (Vercel KV not connected)' });
  }

  const headers = {
    'Authorization': `Bearer ${kvToken}`,
    'Content-Type': 'application/json'
  };

  // Helper to query KV Redis
  async function runKvCommand(command) {
    const response = await fetch(kvUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(command)
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`KV command failed: ${errText}`);
    }
    return await response.json();
  }

  try {
    // ----------------------------------------------------
    // GET: List all users
    // ----------------------------------------------------
    if (req.method === 'GET') {
      const data = await runKvCommand(['HGETALL', 'users_hash']);
      const usersList = [];
      
      if (data.result && Array.isArray(data.result)) {
        // HGETALL returns alternating [key, value, key, value...]
        for (let i = 0; i < data.result.length; i += 2) {
          try {
            usersList.push(JSON.parse(data.result[i + 1]));
          } catch (e) {
            console.error("Failed to parse user JSON", e);
          }
        }
      }
      return res.status(200).json(usersList);
    }

    // ----------------------------------------------------
    // POST: Create a user
    // ----------------------------------------------------
    if (req.method === 'POST') {
      const { action, name, age, email, phone, password } = req.body;

      if (action === 'delete') {
        // Delete a user
        if (!email) {
          return res.status(400).json({ error: 'Email is required to delete user' });
        }
        await runKvCommand(['HDEL', 'users_hash', email.toLowerCase()]);
        // Also delete their progress data
        await runKvCommand(['DEL', `progress:${email.toLowerCase()}`]);
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
      }

      // Default registration action
      if (!name || !age || !email || !phone || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
      }

      const cleanEmail = email.toLowerCase();

      // Check if user already exists
      const existing = await runKvCommand(['HGET', 'users_hash', cleanEmail]);
      if (existing.result !== null) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }

      // Create new user object
      const newUser = {
        name,
        age: parseInt(age, 10),
        email: cleanEmail,
        phone,
        password
      };

      // Save user to Redis Hash
      await runKvCommand(['HSET', 'users_hash', cleanEmail, JSON.stringify(newUser)]);

      // ----------------------------------------------------
      // Send Webhook and Email Notifications in background
      // ----------------------------------------------------
      const webhookUrl = process.env.VITE_DISCORD_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [{
                title: "🚀 Novo Aluno Cadastrado na Plataforma!",
                color: 65280, // Green
                fields: [
                  { name: "Nome", value: name, inline: true },
                  { name: "Idade", value: String(age) + " anos", inline: true },
                  { name: "E-mail", value: cleanEmail, inline: false },
                  { name: "Telefone", value: phone, inline: true }
                ],
                timestamp: new Date().toISOString()
              }]
            })
          });
        } catch (err) {
          console.error("Failed to send webhook notification:", err);
        }
      }

      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'onboarding@resend.dev',
              to: 'thipacheco1@gmail.com',
              subject: '🚀 Novo Aluno Cadastrado na Plataforma!',
              html: `
                <h3>Um novo aluno acaba de se cadastrar na plataforma:</h3>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Idade:</strong> ${age} anos</p>
                <p><strong>E-mail:</strong> ${cleanEmail}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <br/>
                <p>Este e-mail foi gerado automaticamente pela plataforma Formação Java Thiago.</p>
              `
            })
          });
        } catch (err) {
          console.error("Failed to send email notification:", err);
        }
      }

      return res.status(200).json({ success: true, user: newUser });
    }

    // ----------------------------------------------------
    // PUT: Update user (like reset password)
    // ----------------------------------------------------
    if (req.method === 'PUT') {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const cleanEmail = email.toLowerCase();
      const existing = await runKvCommand(['HGET', 'users_hash', cleanEmail]);
      if (existing.result === null) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = JSON.parse(existing.result);
      user.password = password;

      await runKvCommand(['HSET', 'users_hash', cleanEmail, JSON.stringify(user)]);
      return res.status(200).json({ success: true, message: 'Senha redefinida com sucesso!' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Users Error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};
