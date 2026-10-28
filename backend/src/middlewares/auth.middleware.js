module.exports = (req, res, next) => {
  // Ignora o token e define um utilizador padrão para prosseguir sem erros
  req.userId = 'meu_usuario_id';
  return next();
};