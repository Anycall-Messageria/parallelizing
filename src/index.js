import { initialize } from "./cluster.js"
import { getPostgresConnection } from './db.js'
import BiCredores from './models/bi_credores.model.js'
import BiCredoresParalelo from './models/bi_credores_paralelo.model.js'
import cliProgress from 'cli-progress'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const postgresDB = await getPostgresConnection()
const ITEMS_PER_PAGE = 4000
const CLUSTER_SIZE = 10
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TASK_FILE = join(__dirname, 'background-task.js')

console.log('🚀 Iniciando migração de bi_credores...')

// Marcar registros antigos como STATUS = 0
console.log('🔄 Marcando registros antigos como STATUS = 0...')
await BiCredoresParalelo.update(
    { STATUS: 0 }, 
    { where: {} }
)

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

const total = await BiCredores.count()
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
            const deletedCount = await BiCredoresParalelo.destroy({
                where: { STATUS: 0 }
            })
            console.log(`🗑️  Registros antigos removidos: ${deletedCount.toLocaleString()}`)

            const insertedCount = await BiCredoresParalelo.count()
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

let batchCount = 0
for await (const data of getAllPagedData(ITEMS_PER_PAGE)) {
    batchCount++
    console.log(`📦 Enviando lote ${batchCount} com ${data.length} registros...`)
    cp.sendToChild({ 
        table: 'bi_credores', 
        data: data,
        count: data.length
    })
}

console.log('📤 Todos os lotes enviados para processamento...')
console.log('🔍 Aguardando processamento dos workers...')