const pool = require('../config/database');

// Listar todas as transações de custódia
const list = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM escrow_transactions ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('ERRO ESCROW (LIST):', error);
    res.status(500).json({ error: 'Falha ao listar transações de custódia' });
  }
};

// Obter transação por ID
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM escrow_transactions WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('ERRO ESCROW (GET_BY_ID):', error);
    res.status(500).json({ error: 'Falha ao procurar transação' });
  }
};

// Criar nova transação de custódia
const create = async (req, res) => {
  const { valor, status, payment_intent_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO escrow_transactions (valor, status, payment_intent_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [valor, status || 'pendente', payment_intent_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('ERRO ESCROW (CREATE):', error);
    res.status(500).json({ error: 'Falha ao criar transação de custódia' });
  }
};

// Atualizar status da transação de custódia
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pendente', 'pago', 'concluido', 'cancelado'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Status inválido. Valores aceites: ${validStatuses.join(', ')}`
    });
  }

  try {
    const result = await pool.query(
      `UPDATE escrow_transactions 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transação de custódia não encontrada.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('ERRO ESCROW (UPDATE_STATUS):', error);
    res.status(500).json({ error: 'Falha ao atualizar status da transação', details: error.message });
  }
};

module.exports = { list, getById, create, updateStatus };