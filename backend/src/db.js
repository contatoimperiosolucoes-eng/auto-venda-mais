const Database = require('better-sqlite3');
const path = require('path');

// Cria o banco de dados dentro da pasta backend
const db = new Database(path.resolve(__dirname, '../database.sqlite'));

// Tabela de veículos
db.exec(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    userId TEXT,
    tipo TEXT NOT NULL,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    ano INTEGER NOT NULL,
    preco REAL NOT NULL,
    quilometragem REAL DEFAULT 0,
    placa_chassi TEXT,
    potencia TEXT,
    autonomia TEXT,
    descricao TEXT,
    telefone TEXT,
    plano_destaque TEXT DEFAULT 'gratis',
    status TEXT DEFAULT 'ativo',
    fotos TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;