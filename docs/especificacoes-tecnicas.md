# Especificações Técnicas - Sistema de Migração Paralela

## Visão Geral Técnica

Sistema Node.js especializado em migração massiva de dados entre SQL Server e PostgreSQL, utilizando arquitetura de processamento paralelo com child processes para otimização de performance.

## Stack Tecnológico

### Runtime e Linguagem
- **Node.js**: v18.17.1 (ES Modules)
- **JavaScript**: ECMAScript 2022+ com módulos ES6+
- **Arquitetura**: Multiprocesso com child_process fork

### Dependências Principais

#### ORM e Banco de Dados
```json
{
  "sequelize": "^6.23.2",    // ORM multi-dialeto
  "mssql": "^11.0.1",        // Driver SQL Server
  "pg": "^8.10.0",           // Driver PostgreSQL  
  "tedious": "^18.6.1",      // Driver SQL Server (alternativo)
  "sqlite3": "^5.1.7"        // Driver SQLite (desenvolvimento)
}
```

#### Interface e Utilidades
```json
{
  "cli-progress": "^3.12.0", // Barra de progresso
  "draftlog": "^1.0.13",     // Log dinâmico
  "dotenv": "^16.0.0"        // Variáveis ambiente
}
```

#### Desenvolvimento
```json
{
  "@faker-js/faker": "^8.4.1" // Geração dados teste
}
```

## Arquitetura de Dados

### Modelo bi_credores

#### Estrutura da Tabela
```sql
CREATE TABLE bi_credores (
    id SERIAL PRIMARY KEY,
    CPF VARCHAR(14) NOT NULL,
    DEVEDOR_ID BIGINT NOT NULL,
    CONT_ID SMALLINT,
    NUMERO_CONTRATO VARCHAR(50),
    ACORDO_ID VARCHAR(9),
    MIN_VENCIMENTO DATE,
    MAX_VENCIMENTO DATE,
    PLANO SMALLINT,
    MIN_PARCELAS SMALLINT,
    MAX_PARCELAS SMALLINT,
    MAX_ATRASO INTEGER,
    TT_PARCELAS INTEGER,
    CIDADE VARCHAR(30) NOT NULL,
    UF VARCHAR(2),
    DATA_BATIMENTO DATE,
    DATA_INCLUSAO DATE,
    DATA_IMPORTACAO DATE,
    DATA_VENCIMENTO_ANTIGO DATE,
    DATA_ULTIMO_ACIONAMENTO DATE,
    DATA_PROXIMO_ACIONAMENTO DATE,
    ACAO_ID INTEGER,
    SALDO DECIMAL(38,2),
    SALDO_DEV_TT DECIMAL(38,2),
    TT_CONTRATOS INTEGER,
    CPC INTEGER,
    FAIXA_CREDOR VARCHAR(30),
    FAIXA_CREDOR_MJ VARCHAR(30),
    DESCRICAO VARCHAR(50),
    PER_PLANO_PAGO INTEGER,
    PNP INTEGER DEFAULT 0,
    TOTAL_ESFORCO INTEGER DEFAULT 0,
    ESFORCO_DISCADOR INTEGER DEFAULT 0,
    PISITIVAS INTEGER DEFAULT 0,
    NEGATIVAS INTEGER DEFAULT 0,
    DATA_BASE DATE,
    STATUS INTEGER DEFAULT 1,
    PRODUTO_ID VARCHAR(50),
    DATA_ACIONAMENTO_COLCHAO DATE
);
```

### Configurações de Conexão

#### SQL Server (Origem)
```javascript
{
  host: '192.168.1.220',
  port: 1433,
  dialect: 'mssql',
  database: 'BI_CLIENTES',
  username: 'sa',
  dialectOptions: {
    options: {
      requestTimeout: 300000,      // 5 minutos
      encrypt: false,
      trustServerCertificate: true
    }
  },
  pool: {
    max: 5,          // Máximo 5 conexões
    min: 0,          // Mínimo 0 conexões
    acquire: 300000, // 5 minutos para obter conexão
    idle: 10000      // 10 segundos idle antes de fechar
  }
}
```

#### PostgreSQL (Destino)
```javascript
{
  host: '144.91.80.153',
  port: 5432,
  dialect: 'postgres',
  database: 'BI_CLIENTES',
  username: 'postgres',
  dialectOptions: {
    connectTimeout: 300000 // 5 minutos
  },
  pool: {
    max: 5,          // Máximo 5 conexões
    min: 0,          // Mínimo 0 conexões  
    acquire: 300000, // 5 minutos para obter conexão
    idle: 10000      // 10 segundos idle antes de fechar
  }
}
```

## Algoritmos e Estratégias

### Algoritmo de Distribuição (Round-Robin)
```javascript
function roundRoubin(array, index = 0) {
    return function () {
        if (index >= array.length) index = 0
        return array[index++]
    }
}
```

### Estratégia de Paginação
```javascript
async function* getAllPagedData(itemsPerPage, page = 0) {
    const data = await BiCredores.findAll({
        offset: page,
        limit: itemsPerPage,
        raw: true
    })
    
    if (!data.length) return
    yield data
    yield* getAllPagedData(itemsPerPage, page + itemsPerPage)
}
```

### Processamento em Lote
```javascript
await model.bulkCreate(data, { 
    ignoreDuplicates: true,  // Ignora duplicatas
    validate: false          // Skip validações para performance
})
```

## Configurações de Performance

### Parâmetros Otimizados
```javascript
const ITEMS_PER_PAGE = 4000    // Tamanho do lote por worker
const CLUSTER_SIZE = 99        // Número máximo de workers
const TASK_FILE = './background-task.js'  // Arquivo worker
```

### Métricas de Performance Esperadas
- **Throughput**: ~208.333 registros/segundo (1M em 80s)
- **Latência**: < 100ms por lote de 4000 registros
- **Memória**: ~50MB por worker ativo
- **CPU**: Utilização próxima a 100% em processamento intensivo

## Protocolos de Comunicação

### Mensagens Worker → Master
```javascript
// Sucesso de lote
{
  type: 'batch-completed',
  count: 4000,
  table: 'bi_credores',
  worker: 12345
}

// Erro de processamento
{
  type: 'error',
  error: 'Connection timeout',
  worker: 12345,
  table: 'bi_credores'
}
```

### Mensagens Master → Worker
```javascript
{
  table: 'bi_credores',
  data: [...], // Array com 4000 registros
  count: 4000
}
```

## Estratégias de Tolerância a Falhas

### Detecção de Erros
- Timeout de conexão: 300 segundos
- Retry automático: Não implementado
- Fallback: Termination com log de erro

### Recuperação de Estado
1. Registros marcados com STATUS = 0 antes da migração
2. Verificação de integridade pós-migração
3. Limpeza automática de registros obsoletos
4. Relatório de diferenças identificadas

## Especificações de Hardware

### Requisitos Mínimos
- **CPU**: 4 cores (para suportar 99 workers)
- **RAM**: 8GB (workers + cache de banco)
- **Rede**: 100Mbps (latência < 50ms entre servidores)
- **Storage**: SSD recomendado para logs

### Requisitos Recomendados
- **CPU**: 8+ cores (melhor paralelismo)
- **RAM**: 16GB+ (buffer para picos de memória)
- **Rede**: 1Gbps (transferência otimizada)
- **Storage**: NVMe SSD (I/O otimizado)

## Limitações Técnicas

### Limitações de Sistema
- **Processos simultâneos**: Limitado por `ulimit -n`
- **Memória heap**: V8 default (~1.7GB em 64-bit)
- **File descriptors**: Sistema operacional dependente
- **Network sockets**: Pool de conexões limitado

### Limitações de Banco
- **SQL Server**: Máximo 32.767 conexões simultâneas
- **PostgreSQL**: Configurável (default 100)
- **Timeout**: 300 segundos por operação
- **Transaction log**: Dependente do tamanho configurado

## Segurança e Compliance

### Vulnerabilidades Identificadas
⚠️ **CRÍTICO**: Credenciais hardcoded em `src/db.js`
⚠️ **ALTO**: Sem criptografia SSL/TLS configurada
⚠️ **MÉDIO**: Logs podem conter informações sensíveis

### Recomendações de Segurança
```javascript
// Implementar variáveis de ambiente
const DB_CONFIG = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}
```

## Monitoramento e Observabilidade

### Métricas Coletadas
- Registros processados por segundo
- Tempo de resposta por lote
- Taxa de erro por worker
- Utilização de memória
- Status de conexões ativas

### Logs Estruturados
```javascript
console.log({
  timestamp: new Date().toISOString(),
  level: 'INFO',
  worker: process.pid,
  table: 'bi_credores',
  action: 'batch-completed',
  count: 4000,
  duration: 150
})
```

## Plano de Evolução

### Melhorias Prioritárias
1. **Configuração via arquivo**: Migrar para config.json
2. **Retry automático**: Implementar backoff exponencial
3. **SSL/TLS**: Habilitar criptografia de dados
4. **Métricas avançadas**: Prometheus/Grafana
5. **Health checks**: Monitoramento de saúde dos workers

### Otimizações Futuras
- **Streaming**: Implementar streams para grandes datasets
- **Particionamento**: Divisão inteligente baseada em chaves
- **Cache**: Redis para metadados frequentes
- **Compressão**: Gzip para transferência de dados