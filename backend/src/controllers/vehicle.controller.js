const db = require('../db');

// Listar todos os veículos
exports.getVehicles = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM vehicles ORDER BY created_at DESC').all();
    
    const vehicles = rows.map((v) => ({
      ...v,
      fotos: v.fotos ? JSON.parse(v.fotos) : []
    }));

    return res.json(vehicles);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    return res.status(500).json({ error: 'Erro ao carregar veículos' });
  }
};

// Obter veículo por ID
exports.getVehicleById = (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    return res.json({
      ...vehicle,
      fotos: vehicle.fotos ? JSON.parse(vehicle.fotos) : []
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar veículo' });
  }
};

// Criar veículo
exports.createVehicle = (req, res) => {
  try {
    const {
      tipo, marca, modelo, ano, preco,
      quilometragem, placa_chassi, potencia, autonomia,
      descricao, telefone, plano_destaque, fotos
    } = req.body;

    const id = Date.now().toString();
    const userId = req.user?.id || req.body.userId || 'meu_usuario_id';
    const status = 'ativo';
    const fotosJson = JSON.stringify(fotos || []);

    const stmt = db.prepare(`
      INSERT INTO vehicles (
        id, userId, tipo, marca, modelo, ano, preco,
        quilometragem, placa_chassi, potencia, autonomia,
        descricao, telefone, plano_destaque, status, fotos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id, userId, tipo, marca, modelo, Number(ano), Number(preco),
      Number(quilometragem || 0), placa_chassi || '', potencia || '', autonomia || '',
      descricao || '', telefone || '', plano_destaque || 'gratis', status, fotosJson
    );

    return res.status(201).json({
      id,
      userId,
      tipo,
      marca,
      modelo,
      ano: Number(ano),
      preco: Number(preco),
      quilometragem: Number(quilometragem || 0),
      placa_chassi,
      potencia,
      autonomia,
      descricao,
      telefone,
      plano_destaque: plano_destaque || 'gratis',
      status,
      fotos: fotos || []
    });
  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar anúncio' });
  }
};

// Atualizar veículo (usado por PUT e PATCH)
exports.updateVehicle = (req, res) => {
  try {
    const { id } = req.params;
    const current = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);

    if (!current) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    const {
      tipo, marca, modelo, ano, preco,
      quilometragem, placa_chassi, potencia, autonomia,
      descricao, telefone, plano_destaque, status, fotos
    } = req.body;

    const updatedFotos = fotos !== undefined ? JSON.stringify(fotos) : current.fotos;

    const stmt = db.prepare(`
      UPDATE vehicles SET
        tipo = COALESCE(?, tipo),
        marca = COALESCE(?, marca),
        modelo = COALESCE(?, modelo),
        ano = COALESCE(?, ano),
        preco = COALESCE(?, preco),
        quilometragem = COALESCE(?, quilometragem),
        placa_chassi = COALESCE(?, placa_chassi),
        potencia = COALESCE(?, potencia),
        autonomia = COALESCE(?, autonomia),
        descricao = COALESCE(?, descricao),
        telefone = COALESCE(?, telefone),
        plano_destaque = COALESCE(?, plano_destaque),
        status = COALESCE(?, status),
        fotos = ?
      WHERE id = ?
    `);

    stmt.run(
      tipo, marca, modelo, ano ? Number(ano) : null, preco ? Number(preco) : null,
      quilometragem !== undefined ? Number(quilometragem) : null, placa_chassi,
      potencia, autonomia, descricao, telefone, plano_destaque, status,
      updatedFotos, id
    );

    const updated = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
    return res.json({
      ...updated,
      fotos: updated.fotos ? JSON.parse(updated.fotos) : []
    });
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    return res.status(500).json({ error: 'Erro ao atualizar veículo' });
  }
};

// Excluir veículo
exports.deleteVehicle = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM vehicles WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    return res.json({ message: 'Veículo removido com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir veículo:', error);
    return res.status(500).json({ error: 'Erro ao excluir veículo' });
  }
};