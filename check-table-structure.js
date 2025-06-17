import { getPostgresConnection } from './src/db.js'

try {
    const postgres = await getPostgresConnection()
    
    const [columns] = await postgres.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'bi_credores_origem'
        ORDER BY ordinal_position
    `)
    
    console.log('📋 Estrutura da tabela bi_credores_origem:')
    columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`)
    })
    
    await postgres.close()
    
} catch (error) {
    console.error('❌ Erro:', error.message)
}