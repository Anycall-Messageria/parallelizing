# Implementação da Migração de Dados - SQL Server para PostgreSQL

## Objetivo
Migrar dados das tabelas `bi_credores` e `resumo_faixas` do SQL Server para PostgreSQL utilizando paralelização com `child_process` para processamento em larga escala.

## Arquitetura da Solução

### Fluxo de Dados
```
SQL Server (Origem) --> Node.js Master Process --> Child Processes --> PostgreSQL (Destino)
                            |                           |
                      [Paginação 4000]           [99 Workers]
                      [Progress Monitor]          [Batch Insert]
```

### Componentes Principais

#### 1. **index.js** - Orquestrador Principal
- **Função**: Coordena toda a migração
- **Responsabilidades**:
  - Conectar aos bancos SQL Server e PostgreSQL
  - Implementar paginação para leitura dos dados
  - Criar cluster de 99 processos filhos
  - Monitorar progresso da migração
  - Validar integridade (contagem total)

#### 2. **background-task.js** - Worker Process  
- **Função**: Processa lotes de dados em paralelo
- **Responsabilidades**:
  - Receber lotes de dados via IPC
  - Inserir dados no PostgreSQL usando Sequelize
  - Notificar conclusão ao processo pai

#### 3. **Models Sequelize**
- **bi_credores.model.js**: Conecta ao SQL Server (origem)
- **bi_credores_paralelo.model.js**: Conecta ao PostgreSQL (destino)
- **resumo_faixas.model.js**: Conecta ao SQL Server (origem)  
- **resumo_faixas_paralelo.model.js**: Conecta ao PostgreSQL (destino)

## Estratégia de Implementação

### Fase 1: Migração bi_credores
1. **Leitura**: Buscar dados da tabela `bi_credores` no SQL Server em lotes de 4000
2. **Processamento**: Distribuir lotes entre 99 processos filhos via round-robin
3. **Inserção**: Cada worker insere seu lote no PostgreSQL
4. **Monitoramento**: Progress bar em tempo real
5. **Validação**: Comparar totais entre origem e destino

### Fase 2: Migração resumo_faixas
- Mesmo processo da Fase 1, adaptado para a tabela `resumo_faixas`

## Configurações

### Performance
- **ITEMS_PER_PAGE**: 4000 registros por lote
- **CLUSTER_SIZE**: 99 processos simultâneos
- **REQUEST_TIMEOUT**: 300 segundos

### Estrutura de Arquivos
```
src/
├── index.js                    # Orquestrador principal
├── background-task.js          # Worker para inserção
├── cluster.js                  # Gerenciamento de processos
├── db.js                      # Conexões de banco
└── models/
    ├── bi_credores.model.js           # SQL Server (origem)
    ├── bi_credores_paralelo.model.js  # PostgreSQL (destino)
    ├── resumo_faixas.model.js         # SQL Server (origem)
    └── resumo_faixas_paralelo.model.js # PostgreSQL (destino)
```

## Fluxo de Execução

### 1. Inicialização
```javascript
// Conectar aos bancos
const sqlServer = await getSqlConnection()
const postgresDB = await getPostgresConnection()

// Configurar cluster
const cp = initialize({
    clusterSize: 99,
    backgroundTaskFile: './background-task.js'
})
```

### 2. Paginação e Distribuição
```javascript
// Generator para paginação
async function* getAllPagedData(model, itemsPerPage, page = 0) {
    const data = await model.findAll({
        offset: page,
        limit: itemsPerPage,
        raw: true
    })
    if (!data.length) return
    yield data
    yield* getAllPagedData(model, itemsPerPage, page + itemsPerPage)
}

// Distribuir para workers
for await (const batch of getAllPagedData(BiCredores, 4000)) {
    cp.sendToChild({ table: 'bi_credores', data: batch })
}
```

### 3. Processamento Paralelo
```javascript
// background-task.js
process.on('message', async ({ table, data }) => {
    const model = table === 'bi_credores' ? BiCredoresParalelo : ResumoFaixasParalelo
    
    try {
        await model.bulkCreate(data, { ignoreDuplicates: true })
        process.send('batch-completed')
    } catch (error) {
        process.send({ error: error.message })
    }
})
```

### 4. Monitoramento
- Progress bar com `cli-progress`
- Contagem em tempo real
- Validação final de integridade

## Vantagens da Abordagem

### Performance
- **99 processos simultâneos**: Máximo aproveitamento de recursos
- **Lotes de 4000**: Balanceamento entre memória e throughput
- **Conexões otimizadas**: Pool de conexões eficiente

### Robustez  
- **Isolamento de processos**: Falha em um worker não afeta outros
- **Round-robin**: Distribuição equilibrada de carga
- **Validação de integridade**: Verificação de totais

### Escalabilidade
- **Configurável**: Fácil ajuste de workers e batch size
- **Modular**: Reutilizável para outras tabelas
- **Monitoramento**: Visibilidade completa do processo

## Métricas Esperadas

### Volume de Dados
- **bi_credores**: ~1M+ registros
- **resumo_faixas**: ~500K+ registros  

### Performance Estimada
- **Throughput**: ~50K-100K registros/minuto
- **Tempo total**: 15-30 minutos (dependendo do volume)
- **Uso de CPU**: Alto durante migração
- **Uso de memória**: Controlado pelos lotes

## Considerações de Segurança
- ✅ Credenciais via variáveis de ambiente
- ✅ Conexões SSL quando possível
- ✅ Logs sem dados sensíveis
- ✅ Timeout de conexão configurado

## Próximos Passos
1. Implementar migração para `bi_credores`
2. Testar com dataset pequeno
3. Ajustar configurações de performance
4. Implementar migração para `resumo_faixas`
5. Adicionar logs estruturados
6. Criar scripts de validação pós-migração