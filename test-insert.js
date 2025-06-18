import BiCredoresParalelo from './src/models/bi_credores_paralelo.model.js'

console.log('🧪 Iniciando teste de inserção no PostgreSQL...')

// Dados de teste simulando estrutura do SQL Server
const testData = [
    {
        CPF: '12345678901',
        DEVEDOR_ID: 1001,
        CONT_ID: 1,
        NUMERO_CONTRATO: 'CONT001',
        ACORDO_ID: 'AC001',
        MIN_VENCIMENTO: new Date('2024-01-01'),
        MAX_VENCIMENTO: new Date('2024-12-31'),
        PLANO: 1,
        MIN_PARCELAS: 1,
        MAX_PARCELAS: 12,
        MAX_ATRASO: 30,
        TT_PARCELAS: 12,
        CIDADE: 'São Paulo',
        UF: 'SP',
        DATA_BATIMENTO: new Date('2024-01-01'),
        DATA_INCLUSAO: new Date('2024-01-01'),
        DATA_IMPORTACAO: new Date('2024-01-01'),
        DATA_VENCIMENTO_ANTIGO: new Date('2024-01-01'),
        DATA_ULTIMO_ACIONAMENTO: new Date('2024-01-01'),
        DATA_PROXIMO_ACIONAMENTO: new Date('2024-01-15'),
        ACAO_ID: 1,
        SALDO: 1500.50,
        SALDO_DEV_TT: 2000.00,
        TT_CONTRATOS: 1,
        CPC: 100,
        FAIXA_CREDOR: 'FAIXA A',
        FAIXA_CREDOR_MJ: 'MJ A',
        DESCRICAO: 'Teste inserção',
        PER_PLANO_PAGO: 50,
        PNP: 0,
        TOTAL_ESFORCO: 5,
        ESFORCO_DISCADOR: 3,
        PISITIVAS: 2,
        NEGATIVAS: 1,
        DATA_BASE: '2024-01-01',
        STATUS: 1,
        PRODUTO_ID: 'PROD001',
        DATA_ACIONAMENTO_COLCHAO: new Date('2024-01-10')
    },
    {
        CPF: '98765432100',
        DEVEDOR_ID: 1002,
        CONT_ID: 2,
        NUMERO_CONTRATO: 'CONT002',
        ACORDO_ID: null, // Testando valor null
        MIN_VENCIMENTO: new Date('2024-02-01'),
        MAX_VENCIMENTO: new Date('2024-11-30'),
        PLANO: 2,
        MIN_PARCELAS: 6,
        MAX_PARCELAS: 24,
        MAX_ATRASO: 60,
        TT_PARCELAS: 18,
        CIDADE: 'Rio de Janeiro',
        UF: 'RJ',
        DATA_BATIMENTO: new Date('2024-02-01'),
        DATA_INCLUSAO: new Date('2024-02-01'),
        DATA_IMPORTACAO: new Date('2024-02-01'),
        DATA_VENCIMENTO_ANTIGO: null, // Testando valor null
        DATA_ULTIMO_ACIONAMENTO: null, // Testando valor null
        DATA_PROXIMO_ACIONAMENTO: new Date('2024-02-15'),
        ACAO_ID: null, // Testando valor null
        SALDO: 2500.75,
        SALDO_DEV_TT: 3000.00,
        TT_CONTRATOS: 2,
        CPC: 200,
        FAIXA_CREDOR: 'FAIXA B',
        FAIXA_CREDOR_MJ: null, // Testando valor null
        DESCRICAO: 'Teste com nulls',
        PER_PLANO_PAGO: null, // Testando valor null
        PNP: null, // Será convertido para 0 pelo defaultValue
        TOTAL_ESFORCO: null, // Será convertido para 0 pelo defaultValue
        ESFORCO_DISCADOR: null, // Será convertido para 0 pelo defaultValue
        PISITIVAS: null, // Será convertido para 0 pelo defaultValue
        NEGATIVAS: null, // Será convertido para 0 pelo defaultValue
        DATA_BASE: '2024-02-01',
        STATUS: 1,
        PRODUTO_ID: null, // Testando valor null
        DATA_ACIONAMENTO_COLCHAO: null // Testando valor null
    }
]

try {
    console.log('📊 Contando registros antes da inserção...')
    const countBefore = await BiCredoresParalelo.count()
    console.log(`📈 Registros antes: ${countBefore}`)

    console.log('💾 Testando inserção de 2 registros...')
    const result = await BiCredoresParalelo.bulkCreate(testData, {
        ignoreDuplicates: true,
        validate: false
    })

    console.log(`✅ Inserção concluída! ${result.length} registros inseridos`)

    console.log('📊 Contando registros após a inserção...')
    const countAfter = await BiCredoresParalelo.count()
    console.log(`📈 Registros depois: ${countAfter}`)
    console.log(`🎯 Diferença: ${countAfter - countBefore}`)

    console.log('🔍 Verificando os últimos registros inseridos...')
    const lastRecords = await BiCredoresParalelo.findAll({
        order: [['id', 'DESC']],
        limit: 5,
        raw: true
    })

    console.log('📋 Últimos 5 registros:')
    lastRecords.forEach((record, index) => {
        console.log(`${index + 1}. ID: ${record.id}, CPF: ${record.CPF}, DEVEDOR_ID: ${record.DEVEDOR_ID}, CIDADE: ${record.CIDADE}`)
    })

    console.log('🧪 Teste concluído com sucesso!')

} catch (error) {
    console.error('❌ Erro no teste:', error.message)
    console.error('💥 Stack trace:', error.stack)
} finally {
    process.exit(0)
}