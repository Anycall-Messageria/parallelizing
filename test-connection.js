import { getSqlConnection, getPostgresConnection } from './src/db.js'

console.log('🔍 Testando conexões...')

try {
    console.log('\n📊 Testando SQL Server...')
    const sqlServer = await getSqlConnection()
    console.log('✅ SQL Server conectado com sucesso!')
    await sqlServer.close()
    
    console.log('\n🐘 Testando PostgreSQL...')
    const postgres = await getPostgresConnection()
    console.log('✅ PostgreSQL conectado com sucesso!')
    await postgres.close()
    
    console.log('\n🎉 Todas as conexões estão funcionando!')
    
} catch (error) {
    console.error('❌ Erro de conexão:', error.message)
    process.exit(1)
}