import { initialize } from "./cluster.js"
import { getSqlConnection, getPostgresConnection } from './db.js'
import ResumoFaixas from './models/resumo_faixas.model.js'
import ResumoFaixasParalelo from './models/resumo_faixas_paralelo.model.js'
import cliProgress from 'cli-progress'
import { setTimeout } from 'node:timers/promises'

const sqlServer = await getSqlConnection()
const postgresDB = await getPostgresConnection()
const ITEMS_PER_PAGE = 4000
const CLUSTER_SIZE = 99
const TASK_FILE = new URL('./background-task.js', import.meta.url).pathname

console.log('🚀 Iniciando migração de resumo_faixas...')

// Marcar registros antigos como STATUS = 0
console.log('🔄 Marcando registros antigos como STATUS = 0...')
await ResumoFaixasParalelo.update(
    { STATUS: 0 }, 
    { where: {} }
)

async function* getAllPagedData(itemsPerPage, page = 0) {
    const data = await ResumoFaixas.findAll({
        offset: page,
        limit: itemsPerPage,
        raw: true
    })
    
    if (!data.length) return

    yield data
    yield* getAllPagedData(itemsPerPage, page + itemsPerPage)
}

const total = await ResumoFaixas.count()
console.log(`📊 Total de registros na origem: ${total.toLocaleString()}`)

const progress = new cliProgress.SingleBar({
    format: 'Migração [{bar}] {percentage}% | {value}/{total} | {duration}s | ETA: {eta}s',
    clearOnComplete: false,
}, cliProgress.Presets.shades_classic);

progress.start(total, 0);
let totalProcessed = 0

const cp = initialize({
    backgroundTaskFile: TASK_FILE,
    clusterSize: CLUSTER_SIZE,
    amountToBeProcessed: total,
    async onMessage(message) {
        if (message.type === 'batch-completed') {
            progress.increment(message.count)
            totalProcessed += message.count
        } else if (message.type === 'error') {
            console.error('❌ Erro no worker:', message.error)
        }

        if (totalProcessed >= total) {
            progress.stop()
            cp.killAll()

            // Limpar registros antigos (STATUS = 0)
            console.log('\n🧹 Removendo registros antigos (STATUS = 0)...')
            const deletedCount = await ResumoFaixasParalelo.destroy({
                where: { STATUS: 0 }
            })
            console.log(`🗑️  Registros antigos removidos: ${deletedCount.toLocaleString()}`)

            const insertedCount = await ResumoFaixasParalelo.count()
            console.log(`\n✅ Migração concluída!`)
            console.log(`📈 Total no SQL Server: ${total.toLocaleString()}`)
            console.log(`📈 Total no PostgreSQL: ${insertedCount.toLocaleString()}`)
            console.log(`🎯 Sucesso: ${total === insertedCount ? 'SIM' : 'NÃO'}`)
            
            if (total !== insertedCount) {
                console.log(`⚠️  Diferença: ${Math.abs(total - insertedCount)} registros`)
            }
            
            process.exit(0)
        }
    }
})

await setTimeout(1000)
console.log(`👥 Iniciando ${CLUSTER_SIZE} workers...`)

for await (const data of getAllPagedData(ITEMS_PER_PAGE)) {
    cp.sendToChild({ 
        table: 'resumo_faixas', 
        data: data,
        count: data.length
    })
}

console.log('📤 Todos os lotes enviados para processamento...')