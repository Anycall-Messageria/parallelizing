# Arquitetura do Sistema de Migração Paralela

## Visão Geral

Este sistema implementa uma solução de migração de dados massiva entre bancos de dados SQL Server e PostgreSQL utilizando processamento paralelo com child processes do Node.js. O objetivo principal é migrar milhões de registros de forma eficiente e rápida.

## Arquitetura Técnica

### Componentes Principais

#### 1. **Módulo Principal (`src/index.js`)**
- **Função**: Coordenador principal da migração
- **Características**:
  - Configura cluster de workers (CLUSTER_SIZE = 99)
  - Processa dados em lotes de 4.000 registros (ITEMS_PER_PAGE)
  - Implementa barra de progresso para acompanhamento
  - Gerencia status dos registros (marca antigos como STATUS = 0)
  - Executa limpeza pós-migração

#### 2. **Gerenciador de Cluster (`src/cluster.js`)**
- **Função**: Gerencia processos filhos e distribuição de carga
- **Características**:
  - Implementa algoritmo Round-Robin para distribuição
  - Gerencia ciclo de vida dos processos (criação/destruição)
  - Controla comunicação entre processo pai e filhos
  - Monitora erros e falhas dos workers

#### 3. **Worker de Background (`src/background-task.js`)**
- **Função**: Processa lotes de dados individualmente
- **Características**:
  - Executa inserções em lote (bulkCreate)
  - Utiliza `ignoreDuplicates: true` para evitar conflitos
  - Desabilita validações para melhor performance
  - Reporta progresso ao processo principal

#### 4. **Camada de Banco de Dados (`src/db.js`)**
- **Função**: Gerencia conexões com SQL Server e PostgreSQL
- **Configurações**:
  - **SQL Server**: 192.168.1.220:1433
  - **PostgreSQL**: 144.91.80.153:5432
  - Pool de conexões otimizado (max: 5, timeout: 300s)
  - Autenticação e configurações específicas por SGBD

### Modelos de Dados

#### **bi_credores** (Origem - SQL Server)
Definido em `src/models/bi_credores.model.js` - conecta à tabela origem no SQL Server através do PostgreSQL.

#### **bi_credores_paralelo** (Destino - PostgreSQL)
Definido em `src/models/bi_credores_paralelo.model.js` - tabela de destino no PostgreSQL.

**Estrutura dos Dados:**
- **Identificação**: id, CPF, DEVEDOR_ID
- **Contratos**: CONT_ID, NUMERO_CONTRATO, ACORDO_ID
- **Temporais**: MIN/MAX_VENCIMENTO, datas de acionamento
- **Financeiros**: SALDO, SALDO_DEV_TT, PLANO
- **Geográficos**: CIDADE, UF
- **Métricas**: TOTAL_ESFORÇO, PNP, PISITIVAS, NEGATIVAS
- **Controle**: STATUS, DATA_BASE

## Estratégia de Performance

### 1. **Processamento Paralelo**
- 99 workers simultâneos para maximizar throughput
- Distribuição Round-Robin para balanceamento de carga
- Processamento assíncrono não-bloqueante

### 2. **Otimização de Lotes**
- Lotes de 4.000 registros para equilibrar memória e performance
- `bulkCreate` com `ignoreDuplicates` para inserções rápidas
- Validações desabilitadas durante inserção

### 3. **Gerenciamento de Memória**
- Paginação com generator functions para controle de memória
- Pool de conexões limitado para evitar sobrecarga
- Timeouts configurados para operações longas

### 4. **Estratégia de Consistência**
- Marcação de registros antigos (STATUS = 0) antes da migração
- Verificação de integridade pós-migração
- Limpeza automática de registros obsoletos

## Monitoramento e Observabilidade

### Métricas Coletadas
- Total de registros processados
- Progresso em tempo real (barra de progresso)
- Contagem de sucessos/falhas por worker
- Tempo de execução e ETA

### Logs e Alertas
- Status de conexão dos bancos
- Erros por worker individual
- Relatório final de migração
- Validação de integridade dos dados

## Configurações de Ambiente

### Variáveis Críticas
- `CLUSTER_SIZE`: Número de workers (padrão: 99)
- `ITEMS_PER_PAGE`: Tamanho do lote (padrão: 4.000)
- Credenciais de banco (hardcoded em `db.js`)

### Dependências Principais
- **sequelize**: ORM para ambos os SGBDs
- **mssql**: Driver SQL Server
- **pg**: Driver PostgreSQL
- **cli-progress**: Interface de progresso
- **child_process**: Processamento paralelo nativo

## Considerações de Segurança

⚠️ **ATENÇÃO**: As credenciais de banco estão hardcoded no arquivo `src/db.js`. Recomenda-se:
- Migrar para variáveis de ambiente
- Implementar rotação de senhas
- Utilizar conexões criptografadas em produção
- Implementar logs de auditoria

## Limitações e Restrições

1. **Processos Simultâneos**: Limitado pela capacidade do SO
2. **Memória**: Dependente do tamanho dos lotes
3. **Rede**: Performance limitada pela latência entre servidores
4. **Banco de Dados**: Limitado pelas conexões máximas configuradas

## Casos de Uso

### Migração bi_credores
```bash
npm run migrate:bi-credores
```

### Migração resumo_faixas
```bash
npm run migrate:resumo-faixas
```

### Migração Completa
```bash
npm run migrate:all
```

Esta arquitetura permite migrar milhões de registros em questão de minutos, aproveitando ao máximo os recursos de hardware disponíveis através do processamento paralelo otimizado.