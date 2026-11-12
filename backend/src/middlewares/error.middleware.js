/**
 * Middleware centralizado de tratamento de erros
 */
export function errorHandler(err, req, res, next) {
  console.error('❌ Erro capturado:', err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno no servidor';

  res.status(statusCode).json({
    sucesso: false,
    erro: {
      mensagem: message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Middleware para rotas inexistentes (404)
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    sucesso: false,
    erro: {
      mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
      status: 404,
      timestamp: new Date().toISOString()
    }
  });
}
