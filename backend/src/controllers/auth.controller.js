const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Registro de novo usuário
const register = async (req, res) => {
  const { nome, email, senha, telefone, tipo_usuario } = req.body;

  // Validação básica
  if (!nome || !email || !senha || !telefone || !tipo_usuario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome, email, senha, telefone, tipo_usuario' });
  }

  // Validação de email simples
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  // Validação de senha (mínimo 6 caracteres)
  if (senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
  }

  try {
    // Verifica se o email já está cadastrado
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Este email já está cadastrado' });
    }

    // Criptografa a senha
    const saltRounds = 10;
    const senha_hash = await bcrypt.hash(senha, saltRounds);

    // Insere o usuário na tabela users
    const result = await pool.query(
      `INSERT INTO users (nome, email, senha_hash, telefone, tipo_usuario)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, email, telefone, tipo_usuario, created_at`,
      [nome, email, senha_hash, telefone, tipo_usuario]
    );

    const user = result.rows[0];

    // Gera o token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, tipo_usuario: user.tipo_usuario },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retorna o usuário (sem senha_hash) e o token
    res.status(201).json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        tipo_usuario: user.tipo_usuario,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('ERRO AUTH (REGISTER):', error);
    res.status(500).json({ error: 'Falha ao registrar usuário' });
  }
};

// Login do usuário
const login = async (req, res) => {
  const { email, senha } = req.body;

  // Validação básica
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Busca o usuário pelo email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];

    // Compara a senha com o hash armazenado
    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, tipo_usuario: user.tipo_usuario },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retorna o usuário (sem senha_hash) e o token
    res.status(200).json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        tipo_usuario: user.tipo_usuario,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('ERRO AUTH (LOGIN):', error);
    res.status(500).json({ error: 'Falha ao fazer login' });
  }
};

module.exports = { register, login };