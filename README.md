# PrintManager - Sistema de Gestão de Ficheiros de Impressão

Sistema de produção completo, offline-ready, para gestão de ficheiros de impressão. Aplicações separadas para clientes e operadores.

## Características

- **Cliente (sem login)**: Upload de ficheiros sem autenticação
- **Operador (com PIN)**: Gestão de fila FIFO com prioridades
- **Rastreamento**: Clientes podem rastrear status dos trabalhos
- **UI Simples**: Interface limpa com cores vivas
- **Banco de Dados Real**: PostgreSQL/Neon com SQL
- **API Production-Ready**: Rotas otimizadas e escaláveis

## Setup

### 1. Variáveis de Ambiente

\`\`\`bash
DATABASE_URL=postgresql://user:password@host/database
\`\`\`

### 2. Criar Base de Dados

Execute o script SQL em `scripts/01-init-schema.sql`:

\`\`\`sql
-- No seu cliente PostgreSQL ou Neon
\i scripts/01-init-schema.sql
\`\`\`

### 3. Instalar Dependências

\`\`\`bash
npm install @neondatabase/serverless
\`\`\`

### 4. Rodar Aplicação

\`\`\`bash
npm run dev
\`\`\`

## Estrutura da Aplicação

### URLs Públicas

- **`/`** - Home (seleção entre cliente e operador)
- **`/client`** - Upload de ficheiros (sem login)
- **`/operator`** - Dashboard do operador (PIN: 1234, 5678, 9012)
- **`/track`** - Rastreamento de trabalhos

### API Endpoints

\`\`\`
POST   /api/jobs                    - Criar novo trabalho
GET    /api/jobs                    - Listar trabalhos
GET    /api/jobs/[id]               - Detalhes de um trabalho
PATCH  /api/jobs/[id]               - Atualizar status
POST   /api/operator/verify         - Verificar PIN do operador
GET    /api/operator/jobs           - Trabalhos do operador
\`\`\`

### Base de Dados

#### Tabela `jobs`
- `id` - UUID primária
- `customer_name` - Nome do cliente
- `customer_email` - Email (opcional)
- `customer_phone` - Telefone (opcional)
- `file_name` - Nome do ficheiro
- `file_size` - Tamanho em bytes
- `quantity` - Número de cópias
- `paper_size` - A4, A3, A5, Letter
- `color_mode` - 'bw' ou 'color'
- `priority` - 'low', 'normal', 'high'
- `status` - 'pending', 'processing', 'completed'
- `assigned_to` - UUID do operador
- `created_at` - Timestamp
- `started_at` - Timestamp do início
- `completed_at` - Timestamp da conclusão

#### Tabela `operators`
- `id` - UUID primária
- `name` - Nome do operador
- `pin` - PIN numérico (único)
- `active` - Boolean
- `created_at` - Timestamp

#### Tabela `status_updates`
- `id` - UUID primária
- `job_id` - Referência a job
- `status` - Status atualizado
- `updated_by` - UUID do operador
- `notes` - Notas opcionais
- `created_at` - Timestamp

## Cores Utilizadas

- **Primária**: Azul vibrante (#5a4fc4)
- **Secundária**: Verde sucesso (#a2d65e)
- **Accent**: Laranja vibrante (#f97316)
- **Warning**: Amarelo (#eab308)
- **Branco**: Fundo claro

## Fluxo de Uso

### Cliente
1. Acede a `/client`
2. Preenche nome, email (opcional), telefone (opcional)
3. Seleciona ficheiro PDF
4. Escolhe tamanho, cores, prioridade e quantidade
5. Clica "Enviar para Impressão"
6. Recebe ID do trabalho
7. Pode rastrear em `/track` com o ID

### Operador
1. Acede a `/operator`
2. Insere PIN (1234, 5678 ou 9012)
3. Vê fila FIFO com trabalhos pendentes
4. Clica em trabalho para ver detalhes
5. Clica "Iniciar Impressão" → muda para 'processing'
6. Clica "Marcar como Concluído" → muda para 'completed'

## Produção

1. Deploy no Vercel: `vercel deploy`
2. Configurar DATABASE_URL no Vercel
3. Executar migrations na base de dados
4. Sistema pronto para usar

## Notas

- Sistema funciona offline com cache
- Sem dependência de internet para operações locais
- Fila FIFO respeita prioridades (high > normal > low)
- Todos os dados salvos em PostgreSQL
- UI responsiva e otimizada para mobile
