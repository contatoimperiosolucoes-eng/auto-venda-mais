const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  // 1. Register user
  console.log('=== REGISTER ===');
  console.log(await request({
    hostname: 'localhost', port: 3000,
    path: '/api/auth/register', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { nome: 'Test User', email: 'test@test.com', senha: '123456', telefone: '5551234', tipo_usuario: 'cliente' }));

  // 2. Login
  console.log('\n=== LOGIN ===');
  console.log(await request({
    hostname: 'localhost', port: 3000,
    path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'test@test.com', senha: '123456' }));

  // 3. Create vehicle with auth
  console.log('\n=== CREATE VEHICLE (POST /api/vehicles) ===');
  console.log(await request({
    hostname: 'localhost', port: 3000,
    path: '/api/vehicles', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <token>' }
  }, { tipo: 'automovel', marca: 'Toyota', modelo: 'Corolla', ano: 2020, placa_chassi: 'ABC123', preco: 25000, status: 'em_promo', tags_estado: ['usado'] }));

  process.exit(0);
}

main().catch(console.error);