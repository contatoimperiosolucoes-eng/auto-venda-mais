-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(15),
  tipo_usuario VARCHAR(50) CHECK (tipo_usuario IN ('comprador', 'vendedor', 'admin')) NOT NULL,
  verificado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tipo VARCHAR(50) CHECK (tipo IN ('carro', 'moto', 'eletrico')) NOT NULL,
  marca VARCHAR(255) NOT NULL,
  modelo VARCHAR(255) NOT NULL,
  ano INT NOT NULL,
  placa_chassi VARCHAR(50) UNIQUE NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('disponivel', 'reservado', 'vendido')) NOT NULL,
  tags_estado JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Escrow Transactions Table
CREATE TABLE escrow_transactions (
  id SERIAL PRIMARY KEY,
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  vehicle_id INT REFERENCES vehicles(id),
  valor_total DECIMAL(10, 2) NOT NULL,
  taxa_plataforma DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('aguardando_deposito', 'retido_em_escrow', 'contestado', 'liberado', 'cancelado')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);