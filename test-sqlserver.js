import { Sequelize } from 'sequelize'

console.log('🔍 Testando conexão SQL Server...')

try {
    const sequelize = new Sequelize('BI_CLIENTES', 'sa', '1234', {
        host: '192.168.1.220',
        port: 1433,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                requestTimeout: 30000,
                encrypt: false,
                trustServerCertificate: true
            }
        },
        logging: console.log
    });
    
    await sequelize.authenticate();
    console.log('✅ SQL Server conectado!')
    
    // Verificar se as tabelas existem
    const [tables] = await sequelize.query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME IN ('bi_credores', 'resumo_faixas')
    `);
    
    console.log('📋 Tabelas encontradas:', tables.map(t => t.TABLE_NAME));
    
    await sequelize.close()
    
} catch (error) {
    console.error('❌ Erro SQL Server:', error.message)
    
    if (error.message.includes('Failed to connect')) {
        console.log('💡 Dicas:')
        console.log('   - Verifique se o SQL Server está rodando')
        console.log('   - Verifique se a porta 1433 está aberta')
        console.log('   - Verifique se o IP está correto')
        console.log('   - Verifique se TCP/IP está habilitado no SQL Server')
    }
}