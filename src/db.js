import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

async function getSqlConnection() {
    try {
        const sequelize = new Sequelize(process.env.SQLSERVER_DB, process.env.SQLSERVER_USER, process.env.SQLSERVER_PASSWORD, {
            host: process.env.SQLSERVER_HOST,
            port: process.env.DB_PORT_SQLSERVER,
            dialect: 'mssql',
            dialectOptions: {
                options: {
                    requestTimeout: 300000,
                    encrypt: false,
                    trustServerCertificate: true
                }
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 300000,
                idle: 10000
            },
            logging: false
        });
        
        // Testar conexão
        await sequelize.authenticate();
        console.log('✅ Conexão SQL Server estabelecida');
        return sequelize;
        
    } catch (error) {
        console.error('❌ Erro conectando ao SQL Server:', error.message);
        throw error;
    }
}

async function getPostgresConnection() {
    try {
        const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
            host: process.env.POSTGRES_HOST,
            port: process.env.DB_PORT_POST,
            dialect: 'postgres',
            dialectOptions: {
                connectTimeout: 300000,
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 300000,
                idle: 10000
            },
            logging: false
        });
        
        // Testar conexão
        await sequelize.authenticate();
        console.log('✅ Conexão PostgreSQL estabelecida');
        return sequelize;
        
    } catch (error) {
        console.error('❌ Erro conectando ao PostgreSQL:', error.message);
        throw error;
    }
}

export { getSqlConnection, getPostgresConnection };
