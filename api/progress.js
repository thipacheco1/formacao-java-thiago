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
    // GET: Retrieve a user's progress
    // ----------------------------------------------------
    if (req.method === 'GET') {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const cleanEmail = email.toLowerCase();
      const progressKey = `progress:${cleanEmail}`;

      const data = await runKvCommand(['GET', progressKey]);
      
      if (data.result === null) {
        return res.status(200).json({});
      }

      try {
        const completed = JSON.parse(data.result);
        return res.status(200).json(completed);
      } catch (e) {
        console.error("Failed to parse progress JSON", e);
        return res.status(500).json({ error: 'Failed to parse progress data stored in database' });
      }
    }

    // ----------------------------------------------------
    // POST: Save/Update a user's progress
    // ----------------------------------------------------
    if (req.method === 'POST') {
      const { email, completedLessons } = req.body;

      if (!email || !completedLessons) {
        return res.status(400).json({ error: 'Email and completedLessons are required' });
      }

      const cleanEmail = email.toLowerCase();
      const progressKey = `progress:${cleanEmail}`;

      // Save progress to Redis
      await runKvCommand(['SET', progressKey, JSON.stringify(completedLessons)]);

      return res.status(200).json({ success: true, message: 'Progress saved successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Progress Error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};
