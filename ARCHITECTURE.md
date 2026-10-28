# Arquitetura da Plataforma Auto Venda Mais

## Objetivo da Plataforma
Criar um marketplace seguro, transparente e antifraude para compra e venda de carros, motos e autopropelidos (bicicletas e patinetes elétricos), com foco total na procedência garantida e confiança na transação.

## Arquitetura Geral
- **Frontend**: Aplicação web e mobile utilizando React (para web) e React Native (para mobile).
- **Backend**: API RESTful construída com Node.js e Express.
- **Banco de Dados**: PostgreSQL para armazenamento de dados estruturados.
- **Armazenamento de Mídia**: AWS S3 para armazenamento de fotos e outros arquivos.
- **Autenticação e Autorização**: JSON Web Tokens (JWT) para autenticação e controle de acesso.
- **Notificações**: Serviço de notificações push para alertas e comunicações em tempo real.

## Esquema de Base de Dados

### Tabelas

1. **Users**
   - `id` (serialize, primary key)
   - `username` (text, unique)
   - `email` (text, unique)
   - `password` (text, hashed)
   - `role` (text, enum: 'admin', 'seller', 'buyer')
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **Vehicles**
   - `id` (serialize, primary key)
   - `user_id` (integer, foreign key to `Users.id`)
   - `make` (text)
   - `model` (text)
   - `year` (integer)
   - `plate` (text, unique)
   - `chassis` (text, unique)
   - `vin` (text, unique)
   - `mileage` (integer)
   - `status` (text, enum: 'verified', 'pending', 'rejected')
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

3. **Inspections**
   - `id` (serialize, primary key)
   - `vehicle_id` (integer, foreign key to `Vehicles.id`)
   - `inspection_date` (timestamp)
   - `inspection_status` (text, enum: 'passed', 'failed')
   - `report` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

4. **Listings**
   - `id` (serialize, primary key)
   - `vehicle_id` (integer, foreign key to `Vehicles.id`)
   - `user_id` (integer, foreign key to `Users.id`)
   - `price` (numeric)
   - `description` (text)
   - `status` (text, enum: 'active', 'inactive', 'sold')
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

5. **Transactions**
   - `id` (serialize, primary key)
   - `listing_id` (integer, foreign key to `Listings.id`)
   - `buyer_id` (integer, foreign key to `Users.id`)
   - `seller_id` (integer, foreign key to `Users.id`)
   - `transaction_date` (timestamp)
   - `status` (text, enum: 'pending', 'completed', 'disputed', 'refunded')
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

6. **Financiements**
   - `id` (serialize, primary key)
   - `listing_id` (integer, foreign key to `Listings.id`)
   - `finance_company` (text)
   - `interest_rate` (numeric)
   - `loan_amount` (numeric)
   - `installment_amount` (numeric)
   - `installment_count` (integer)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

7. **Insurance**
   - `id` (serialize, primary key)
   - `listing_id` (integer, foreign key to `Listings.id`)
   - `insurance_company` (text)
   - `monthly_premium` (numeric)
   - `coverage_amount` (numeric)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

## Fluxos de Trabalho

1. **Cadastro de Usuário**
   - Usuários podem se registrar como compradores ou vendedores.
   - Validação de dados de entrada (email, username, password).
   - Envio de email de confirmação.

2. **Publicação de Anúncio**
   - Vendedores podem adicionar veículos com informações detalhadas.
   - Upload de fotos padronizadas.
   - Verificação veicular automatizada.
   - Atribuição de badges e tags de estado.

3. **Compra de Veículo**
   - Compradores podem procurar e comprar veículos.
   - Pagamento em escrow.
   - Validação presencial e transferência de documentos.
   - Fluxo de contestação e devolução.

4. **Financiamento**
   - Simulação de financiamento no anúncio.
   - Envio de leads qualificados para financeiras parceiras.

5. **Seguro**
   - Cotação de seguro em tempo real.
   - Split de comissão de 30% da taxa de adesão para a plataforma.

## Segurança

- **Autenticação e Autorização**: JWT para autenticação e controle de acesso.
- **Validação de Dados**: Validação em backend para evitar injeção de SQL e outros ataques.
- **Criptografia**: Senhas armazenadas com hash seguro.
- **Segurança em Armazenamento de Mídia**: Uso de AWS S3 com políticas de acesso restritas.

## Considerações Técnicas

- **Escalabilidade**: Arquitetura modular para facilitar a expansão.
- **Performance**: Otimização de consultas ao banco de dados e cache de dados frequentemente acessados.
- **Manutenibilidade**: Códigos bem organizados e documentados.
- **Testes**: Implementação de testes unitários e de integração.