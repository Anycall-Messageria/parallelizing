import { Sequelize } from 'sequelize'

console.log('🔍 Teste simples de conexão PostgreSQL...')

try {
    const sequelize = new Sequelize('BI_CLIENTES', 'postgres', '1977@30@04', {
        host: '144.91.80.153',
        port: 5432,
        dialect: 'postgres',
        logging: console.log
    });
    
    await sequelize.authenticate();
    console.log('✅ PostgreSQL funcionando!')
    await sequelize.close()
    
} catch (error) {
    console.error('❌ Erro PostgreSQL:', error.message)
    console.error('Stack:', error.stack)
}