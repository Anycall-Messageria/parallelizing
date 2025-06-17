# Guia de Migração - SQL Server para PostgreSQL

## Pré-requisitos

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```env
# SQL Server (Origem)
SQLSERVER_HOST=seu_host_sqlserver
SQLSERVER_DB=BI_CLIENTES
SQLSERVER_USER=seu_usuario
SQLSERVER_PASSWORD=sua_senha

# PostgreSQL (Destino)
POSTGRES_HOST=seu_host_postgres
POSTGRES_DB=BI_CLIENTES
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
```

### 2. Dependências
```bash
npm install
```

## Comandos Disponíveis

### Migração Individual
```bash
# Migrar apenas bi_credores
npm run migrate:bi-credores

# Migrar apenas resumo_faixas
npm run migrate:resumo-faixas
```

### Migração Completa
```bash
# Migrar ambas as tabelas sequencialmente
npm run migrate:all
```

## Estrutura da Migração

### Tabelas Suportadas
- ✅ **bi_credores**: ~1M+ registros
- ✅ **resumo_faixas**: ~500K+ registros

### Estratégia de Migração Segura
1. **Marcação**: UPDATE todos registros existentes para `STATUS = 0`
2. **Inserção**: INSERT novos dados com `STATUS = 1` (padrão)
3. **Limpeza**: DELETE registros com `STATUS = 0`

### Configurações de Performance
- **Batch Size**: 4.000 registros por lote
- **Workers**: 99 processos simultâneos
- **Timeout**: 300 segundos por conexão

## Monitoramento

### Saída do Console
```
🚀 Iniciando migração de bi_credores...
🔄 Marcando registros antigos como STATUS = 0...
📊 Total de registros na origem: 1.234.567
👥 Iniciando 99 workers...
📤 Todos os lotes enviados para processamento...

Migração [████████████████████] 100% | 1234567/1234567 | 180s | ETA: 0s

🧹 Removendo registros antigos (STATUS = 0)...
🗑️  Registros antigos removidos: 1.200.000

✅ Migração concluída!
📈 Total no SQL Server: 1.234.567
📈 Total no PostgreSQL: 1.234.567
🎯 Sucesso: SIM
```

### Indicadores de Status
- 🚀 **Iniciando**: Processo iniciado
- 🔄 **Marcando**: Registros antigos marcados como STATUS = 0
- 🧹 **Removendo**: Registros antigos sendo deletados
- 🗑️ **Removidos**: Quantidade de registros antigos removidos
- 📊 **Contando**: Verificando total de registros
- 👥 **Workers**: Processos filhos sendo criados
- 📤 **Enviando**: Lotes sendo distribuídos
- ✅ **Concluído**: Migração finalizada
- ⚠️ **Aviso**: Possível inconsistência
- ❌ **Erro**: Falha no processo

## Tratamento de Erros

### Problemas Comuns

#### 1. Muitos Processos Abertos
```
Error: spawn EMFILE
```
**Solução**: Reduzir `CLUSTER_SIZE` no código

#### 2. Timeout de Conexão
```
Error: Connection timeout
```
**Solução**: Verificar conectividade e ajustar timeout

#### 3. Erro de Permissão
```
Error: Access denied
```
**Solução**: Verificar credenciais no .env

#### 4. Tabela não Existe
```
Error: Table doesn't exist
```
**Solução**: Criar tabelas no PostgreSQL antes da migração

## Validação Pós-Migração

### Verificação Automática
O sistema compara automaticamente:
- Total de registros origem vs destino
- Exibe diferenças se houver

### Verificação Manual
```sql
-- SQL Server
SELECT COUNT(*) FROM bi_credores;
SELECT COUNT(*) FROM resumo_faixas;

-- PostgreSQL  
SELECT COUNT(*) FROM bi_credores;
SELECT COUNT(*) FROM resumo_faixas;
```

## Performance Esperada

### Estimativas
| Tabela | Registros | Tempo Estimado | Throughput |
|--------|-----------|----------------|------------|
| bi_credores | 1M | 15-20 min | ~800-1000/seg |
| resumo_faixas | 500K | 8-12 min | ~700-1000/seg |

### Fatores que Afetam Performance
- **Latência de rede** entre servidores
- **Recursos de CPU** disponíveis
- **Largura de banda** da conexão
- **Carga dos bancos** de dados

## Logs e Depuração

### Logs dos Workers
Cada worker exibe seu PID:
```
🔧 Worker 12345 iniciado
🔧 Worker 12346 iniciado
...
```

### Logs de Erro
Erros são exibidos com contexto:
```
❌ Erro no worker 12345: Connection lost
```

## Segurança

### ✅ Implementado
- Credenciais via variáveis de ambiente
- Conexões com timeout configurado
- Logs sem dados sensíveis

### 🔄 Recomendado
- Conexões SSL/TLS
- Rede privada entre servidores
- Backup antes da migração

## Recuperação

### Em Caso de Falha
1. **Parar processo**: Ctrl+C
2. **Verificar logs**: Identificar causa
3. **Corrigir problema**: Ajustar configuração
4. **Reiniciar**: Registros antigos serão marcados novamente

### Migração Parcial
O sistema marca registros antigos como STATUS = 0, garantindo que em caso de falha os dados originais permaneçam íntegros.

## Suporte

### Ajuste de Performance
Edite as constantes no código:
```javascript
const ITEMS_PER_PAGE = 4000  // Tamanho do lote
const CLUSTER_SIZE = 99      // Número de workers
```

### Monitoramento do Sistema
```bash
# Monitorar processos
ps aux | grep node

# Monitorar conexões
netstat -an | grep :1433  # SQL Server
netstat -an | grep :5432  # PostgreSQL
```