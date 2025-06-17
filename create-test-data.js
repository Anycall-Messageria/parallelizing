import { getPostgresConnection } from './src/db.js'
import { faker } from '@faker-js/faker'

console.log('🔧 Criando dados de teste...')

try {
    const postgres = await getPostgresConnection()
    
    // Criar tabela temporária de origem no PostgreSQL
    await postgres.query(`
        CREATE TABLE IF NOT EXISTS bi_credores_origem (
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
            DATA_IMPORTACAO TIMESTAMP,
            DATA_VENCIMENTO_ANTIGO DATE,
            DATA_ULTIMO_ACIONAMENTO TIMESTAMP,
            DATA_PROXIMO_ACIONAMENTO TIMESTAMP,
            ACAO_ID INTEGER,
            SALDO DECIMAL(38,2),
            SALDO_DEV_TT DECIMAL(38,2),
            TT_CONTRATOS INTEGER,
            CPC INTEGER,
            FAIXA_CREDOR VARCHAR(30),
            FAIXA_CREDOR_MJ VARCHAR(30),
            DESCRICAO VARCHAR(50),
            PER_PLANO_PAGO INTEGER,
            PNP INTEGER NOT NULL,
            TOTAL_ESFORCO INTEGER NOT NULL,
            ESFORCO_DISCADOR INTEGER NOT NULL,
            PISITIVAS INTEGER NOT NULL,
            NEGATIVAS INTEGER NOT NULL,
            DATA_BASE DATE,
            STATUS INTEGER DEFAULT 1,
            PRODUTO_ID VARCHAR(50),
            DATA_ACIONAMENTO_COLCHAO TIMESTAMP
        )
    `)
    
    console.log('📊 Inserindo 10.000 registros de teste...')
    
    const batchSize = 1000
    for (let i = 0; i < 10; i++) {
        const values = []
        for (let j = 0; j < batchSize; j++) {
            values.push(`(
                '${faker.helpers.fromRegExp(/[0-9]{11}/)}',
                ${faker.number.int({min: 1000, max: 999999})},
                ${faker.number.int({min: 1, max: 100})},
                '${faker.finance.accountNumber()}',
                '${faker.helpers.fromRegExp(/[A-Z0-9]{9}/)}',
                '${faker.date.past().toISOString().split('T')[0]}',
                '${faker.date.future().toISOString().split('T')[0]}',
                ${faker.number.int({min: 1, max: 10})},
                ${faker.number.int({min: 1, max: 12})},
                ${faker.number.int({min: 12, max: 60})},
                ${faker.number.int({min: 0, max: 365})},
                ${faker.number.int({min: 1, max: 60})},
                '${faker.location.city()}',
                '${faker.location.state({abbreviated: true})}',
                '${faker.date.past().toISOString().split('T')[0]}',
                '${faker.date.past().toISOString().split('T')[0]}',
                '${faker.date.recent().toISOString()}',
                '${faker.date.past().toISOString().split('T')[0]}',
                '${faker.date.recent().toISOString()}',
                '${faker.date.future().toISOString()}',
                ${faker.number.int({min: 1, max: 10})},
                ${faker.finance.amount({min: 100, max: 50000, dec: 2})},
                ${faker.finance.amount({min: 100, max: 50000, dec: 2})},
                ${faker.number.int({min: 1, max: 5})},
                ${faker.number.int({min: 1, max: 5})},
                '${faker.helpers.arrayElement(['BAIXO', 'MEDIO', 'ALTO'])}',
                '${faker.helpers.arrayElement(['A', 'B', 'C'])}',
                '${faker.lorem.words(3)}',
                ${faker.number.int({min: 0, max: 100})},
                ${faker.number.int({min: 0, max: 1})},
                ${faker.number.int({min: 0, max: 100})},
                ${faker.number.int({min: 0, max: 50})},
                ${faker.number.int({min: 0, max: 30})},
                ${faker.number.int({min: 0, max: 20})},
                '${faker.date.recent().toISOString().split('T')[0]}',
                1,
                '${faker.commerce.productName()}',
                '${faker.date.recent().toISOString()}'
            )`)
        }
        
        await postgres.query(`
            INSERT INTO bi_credores_origem (
                CPF, DEVEDOR_ID, CONT_ID, NUMERO_CONTRATO, ACORDO_ID,
                MIN_VENCIMENTO, MAX_VENCIMENTO, PLANO, MIN_PARCELAS, MAX_PARCELAS,
                MAX_ATRASO, TT_PARCELAS, CIDADE, UF, DATA_BATIMENTO,
                DATA_INCLUSAO, DATA_IMPORTACAO, DATA_VENCIMENTO_ANTIGO,
                DATA_ULTIMO_ACIONAMENTO, DATA_PROXIMO_ACIONAMENTO, ACAO_ID,
                SALDO, SALDO_DEV_TT, TT_CONTRATOS, CPC, FAIXA_CREDOR,
                FAIXA_CREDOR_MJ, DESCRICAO, PER_PLANO_PAGO, PNP,
                TOTAL_ESFORCO, ESFORCO_DISCADOR, PISITIVAS, NEGATIVAS,
                DATA_BASE, STATUS, PRODUTO_ID, DATA_ACIONAMENTO_COLCHAO
            ) VALUES ${values.join(', ')}
        `)
        
        console.log(`✅ Lote ${i + 1}/10 inserido`)
    }
    
    console.log('🎉 Dados de teste criados com sucesso!')
    await postgres.close()
    
} catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
}