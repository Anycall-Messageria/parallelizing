import { getPostgresConnection } from './src/db.js'

try {
    const postgres = await getPostgresConnection()
    
    const [result] = await postgres.query('SELECT COUNT(*) as total FROM bi_credores_origem')
    console.log(`📊 Total de registros de origem: ${result[0].total}`)
    
    const [destResult] = await postgres.query('SELECT COUNT(*) as total FROM bi_credores')
    console.log(`🎯 Total de registros no destino: ${destResult[0].total}`)
    
    await postgres.close()
    
} catch (error) {
    console.error('❌ Erro:', error.message)
}