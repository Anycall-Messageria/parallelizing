import BiCredoresParalelo from './models/bi_credores_paralelo.model.js'
import ResumoFaixasParalelo from './models/resumo_faixas_paralelo.model.js'

console.log(`🔧 Worker ${process.pid} iniciado`)

process.on('message', async ({ table, data, count }) => {
    try {
        let model
        
        switch (table) {
            case 'bi_credores':
                model = BiCredoresParalelo
                break
            case 'resumo_faixas':
                model = ResumoFaixasParalelo
                break
            default:
                throw new Error(`Tabela não reconhecida: ${table}`)
        }

        // Inserir lote no PostgreSQL
        await model.bulkCreate(data, { 
            ignoreDuplicates: true,
            validate: false // Para melhor performance
        })

        process.send({
            type: 'batch-completed',
            count: count,
            table: table,
            worker: process.pid
        })

    } catch (error) {
        console.error(`❌ Erro no worker ${process.pid}:`, error.message)
        
        process.send({
            type: 'error',
            error: error.message,
            worker: process.pid,
            table: table
        })
    }
})