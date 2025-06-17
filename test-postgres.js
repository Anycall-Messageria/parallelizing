import { Sequelize } from 'sequelize'

console.log('🔍 Testando conexão PostgreSQL (sem especificar DB)...')

try {
    // Conectar ao banco padrão 'postgres' primeiro
    const sequelize = new Sequelize('postgres', 'postgres', '1977@30@04', {
        host: '144.91.80.153',
        port: 5432,
        dialect: 'postgres',
        logging: false
    });
    
    await sequelize.authenticate();
    console.log('✅ PostgreSQL conectado!')
    
    // Verificar se o banco BI_CLIENTES existe
    const [results] = await sequelize.query(
        "SELECT 1 FROM pg_database WHERE datname = 'BI_CLIENTES'"
    );
    
    if (results.length > 0) {
        console.log('✅ Banco BI_CLIENTES existe!')
    } else {
        console.log('⚠️  Banco BI_CLIENTES não existe')
        console.log('💡 Criando banco BI_CLIENTES...')
        
        try {
            await sequelize.query('CREATE DATABASE "BI_CLIENTES"');
            console.log('✅ Banco BI_CLIENTES criado!')
        } catch (createError) {
            console.log('❌ Erro criando banco:', createError.message)
        }
    }
    
    await sequelize.close()
    
} catch (error) {
    console.error('❌ Erro:', error.message)
}