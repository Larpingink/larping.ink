const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { db } = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = 'supersecret';

// Auth routes
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
    res.sendStatus(200);
  } catch (e) {
    res.status(400).json({ error: 'Username taken' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.sendStatus(401);
  const token = jwt.sign({ id: user.id, username }, SECRET);
  res.json({ token });
});

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);
  try {
    req.user = jwt.verify(header.split(' ')[1], SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

app.post('/api/profile', auth, async (req, res) => {
  const { bio, avatarUrl, displayName } = req.body;
  await db.run('UPDATE users SET bio = ?, avatar = ?, display_name = ? WHERE id = ?', [bio, avatarUrl, displayName, req.user.id]);
  res.sendStatus(200);
});

app.post('/api/links', auth, async (req, res) => {
  const { title, url } = req.body;
  await db.run('INSERT INTO links (user_id, title, url) VALUES (?, ?, ?)', [req.user.id, title, url]);
  res.sendStatus(200);
});

app.get('/api/links', auth, async (req, res) => {
  const links = await db.all('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
  res.json(links);
});

app.get('/api/user/:username', async (req, res) => {
  const user = await db.get('SELECT * FROM users WHERE username = ?', [req.params.username]);
  if (!user) return res.sendStatus(404);
  const links = await db.all('SELECT title, url FROM links WHERE user_id = ?', [user.id]);
  res.json({ username: user.username, displayName: user.display_name, bio: user.bio, avatar: user.avatar, links });
});

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
