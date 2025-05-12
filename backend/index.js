const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pool } = require('./db');
const app = express();
app.use(bodyParser.json());
app.use(cors())
const SECRET = 'mysecretkey'; 

app.post('/signup', async (req, res) => {
  const { name, email, password, country } = req.body;

  if (!name || !email || !password || !country) {
    return res.status(400).json({ error: 'All fields (name, email, password, country) are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const insertResult = await pool.query(
      'INSERT INTO users(name, email, password, country) VALUES($1, $2, $3, $4) RETURNING id, name, email, country',
      [name, email, hashedPassword, country]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Login failed' });
  }
});

async function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    console.log(decoded)
    return decoded.userId;
  } catch (err) {
    console.error("JWT decode error:", err.message);
    return null;
  }
}


app.post('/projects', async (req, res) => {
  const userId = await getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { project_name, status } = req.body;
  if (!project_name || !status) {
    return res.status(400).json({ error: 'Project name and status are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO projects(project_name, status, user_id)
       VALUES($1, $2, $3) RETURNING *`,
      [project_name, status, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Project name must be unique or data invalid' });
  }
});


app.post('/tasks', async (req, res) => {
  const userId = await getUserId(req);
  console.log(userId)
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { project_id, title, description, status, date_of_completion } = req.body;
  if (!project_id || !title || !description || !status) {
    return res.status(400).json({ error: 'Project ID, title, description, and status are required' });
  }

  try {
    const project = await pool.query(
      `SELECT * FROM projects WHERE id = $1 AND user_id = $2`,
      [project_id, userId]
    );
    if (project.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to add task to this project' });
    }

    const result = await pool.query(
      `INSERT INTO tasks(project_id, title, description, status, date_of_completion, user_id)
       VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [project_id, title, description, status, date_of_completion, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Task title must be unique or data invalid '+err.message });
  }
});

app.get('/tasks/:project_id', async (req, res) => {
  const userId = await getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const project = await pool.query(
      `SELECT * FROM projects WHERE id = $1 AND user_id = $2`,
      [req.params.project_id, userId]
    );
    if (project.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized access to project tasks' });
    }

    const result = await pool.query(
      `SELECT * FROM tasks WHERE project_id = $1 AND user_id = $2`,
      [req.params.project_id, userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  const userId = await getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { title, description, status, date_of_completion } = req.body;

  try {
    const taskCheck = await pool.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [req.params.id, userId]
    );
    if (taskCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized or task not found' });
    }

    const result = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3, date_of_completion = $4
       WHERE id = $5 RETURNING *`,
      [title, description, status, date_of_completion, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Update failed or title already used' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const userId = await getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const taskCheck = await pool.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [req.params.id, userId]
    );
    if (taskCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized or task not found' });
    }

    await pool.query(`DELETE FROM tasks WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.get('/projects', async (req, res) => {
  const userId = await getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      `SELECT * FROM projects WHERE user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ------------------ Start Server ------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
