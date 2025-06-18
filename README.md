# Manual do Usuário - Sistema de Migração Paralela

## Introdução

Este sistema foi desenvolvido para migrar grandes volumes de dados entre bancos SQL Server e PostgreSQL de forma eficiente, utilizando processamento paralelo. Capaz de migrar milhões de registros em poucos minutos.

## Pré-requisitos

### Software Necessário
- **Node.js v18.17.1** (versão específica requerida)
- **npm** (gerenciador de pacotes)
- Acesso aos bancos SQL Server e PostgreSQL configurados

### Configuração de Ambiente
1. Clone o repositório
2. Execute `npm install` para instalar dependências
3. Configure as conexões de banco em `src/db.js`

## Comandos Disponíveis

### Configuração Inicial
```bash
# Instalar dependências
npm install

# Criar estrutura de tabelas
npm run setup

# Testar conexões
npm run test:connection
```

### Execução de Migrações

#### Migração Individual - bi_credores
```bash
npm run migrate:bi-credores
# ou
npm start
```

#### Migração Individual - resumo_faixas
```bash
npm run migrate:resumo-faixas
```

#### Migração Completa
```bash
npm run migrate:all
```

### Desenvolvimento
```bash
# Modo desenvolvimento com auto-reload
npm run dev
```

## Como Utilizar

### 1. **Verificação Pré-migração**
Antes de executar a migração, certifique-se de que:
- As conexões com ambos os bancos estão funcionando
- Há espaço suficiente no banco de destino
- Os privilégios de acesso estão corretos

```bash
npm run test:connection
```

### 2. **Execução da Migração**
Execute o comando apropriado baseado na tabela que deseja migrar:

```bash
# Para migrar tabela bi_credores
npm run migrate:bi-credores
```

### 3. **Monitoramento do Progresso**
Durante a execução, você verá:
- Barra de progresso em tempo real
- Número de registros processados
- Tempo decorrido e estimativa de conclusão
- Status dos workers

Exemplo de saída:
```
🚀 Iniciando migração de bi_credores...
✅ Conexão SQL Server estabelecida
✅ Conexão PostgreSQL estabelecida
📊 Total de registros na origem: 1.250.000
👥 Iniciando 99 workers...
Migração [████████████████████] 100% | 1250000/1250000 | 120s | ETA: 0s
✅ Migração concluída!
📈 Total no SQL Server: 1.250.000
📈 Total no PostgreSQL: 1.250.000
🎯 Sucesso: SIM
```

### 4. **Verificação Pós-migração**
O sistema automaticamente:
- Compara o total de registros origem vs destino
- Remove registros antigos marcados como STATUS = 0
- Exibe relatório final de sucesso/falha

## Configurações Avançadas

### Ajuste de Performance

#### Modificar Número de Workers
No arquivo `src/index.js`, altere:
```javascript
const CLUSTER_SIZE = 99  // Reduza se houver erro de "muitos processos"
```

#### Ajustar Tamanho dos Lotes
```javascript
const ITEMS_PER_PAGE = 4000  // Reduza para economizar memória
```

### Configuração de Banco de Dados
Edite `src/db.js` para alterar:
- Endereços dos servidores
- Credenciais de acesso
- Configurações de pool de conexões
- Timeouts

## Solução de Problemas

### Erro: "Muitos processos abertos"
**Sintoma**: Sistema falha com erro de limite de processos
**Solução**: Reduza a variável `CLUSTER_SIZE` no arquivo `src/index.js`

```javascript
const CLUSTER_SIZE = 50  // Reduza de 99 para 50 ou menos
```

### Erro de Conexão com Banco
**Sintoma**: Falha na autenticação ou conexão
**Solução**:
1. Verifique credenciais em `src/db.js`
2. Confirme conectividade de rede
3. Teste com `npm run test:connection`

### Performance Lenta
**Sintoma**: Migração muito demorada
**Soluções**:
1. Aumente `CLUSTER_SIZE` (se hardware permitir)
2. Ajuste `ITEMS_PER_PAGE` para lotes maiores
3. Verifique latência de rede entre servidores
4. Otimize configurações de pool de conexões

### Dados Incompletos
**Sintoma**: Diferença entre total origem e destino
**Verificações**:
1. Revise logs de erro dos workers
2. Verifique restrições de integridade no destino
3. Confirme espaço em disco suficiente
4. Execute novamente a migração

## Arquivos de Teste

### Scripts de Validação
```bash
# Testar conexão com PostgreSQL
node test-postgres.js

# Testar conexão com SQL Server
node test-sqlserver.js

# Verificar estrutura das tabelas
node check-table-structure.js

# Validar dados migrados
node check-data.js
```

### Scripts de Configuração
```bash
# Criar tabelas necessárias
node create-tables.js

# Gerar dados de teste
node create-test-data.js
```

## Logs e Monitoramento

### Informações Registradas
- ✅ Conexões estabelecidas com sucesso
- 🔄 Início de marcação de registros antigos
- 👥 Inicialização dos workers
- 📤 Envio de lotes para processamento
- ❌ Erros de workers individuais
- 🧹 Limpeza de registros antigos
- 📈 Relatório final de migração

### Interpretação dos Logs
- **🚀**: Início de processo
- **✅**: Sucesso em operação
- **❌**: Erro identificado
- **📊**: Informação estatística
- **🎯**: Resultado final

## Considerações de Segurança

⚠️ **IMPORTANTE**: 
- As credenciais estão atualmente hardcoded
- Use este sistema apenas em ambiente controlado
- Considere implementar autenticação por variáveis de ambiente em produção
- Monitore logs para tentativas de acesso não autorizado

## Suporte e Manutenção

### Backup Recomendado
Sempre execute backup dos dados antes da migração:
```sql
-- PostgreSQL
pg_dump -h servidor -U usuario -d banco > backup.sql

-- SQL Server
BACKUP DATABASE [banco] TO DISK = 'caminho/backup.bak'
```

### Manutenção Periódica
- Monitore logs de erro regularmente
- Verifique integridade dos dados migrados
- Atualize dependências conforme necessário
- Revise configurações de performance periodicamente