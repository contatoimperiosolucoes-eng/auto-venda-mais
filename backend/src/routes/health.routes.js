const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'Auto Venda Mais API' });
});

module.exports = router;