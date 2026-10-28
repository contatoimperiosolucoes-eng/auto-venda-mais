const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authMiddleware, JWT_SECRET } = require('../middlewares/auth.middleware');

// Criação da tabela de utilizadores
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'comprador',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// 1. Registo de Utilizador (comprador ou vendedor)
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }

  const userRole = ['comprador', 'vendedor'].includes(role) ? role : 'comprador';

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, email.toLowerCase().trim(), hashedPassword, userRole);

    const token = jwt.sign(
      { id: result.lastInsertRowid, name, email, role: userRole },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registo efetuado com sucesso',
      token,
      user: { id: result.lastInsertRowid, name, email, role: userRole }
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Este e-mail já se encontra registado' });
    }
    res.status(500).json({ error: 'Erro ao registar utilizador' });
  }
});

// 2. Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Forneça e-mail e palavra-passe' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login realizado com sucesso',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// 3. Obter dados do utilizador autenticado
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;