import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const DB_DIALECT_POST='postgres'
const DB_PORT_POST=5432
const POSTGRES_HOST='144.91.80.153'
const POSTGRES_USER='postgres'
const POSTGRES_PASSWORD='1977@30@04'
const POSTGRES_DB='BI_CLIENTES'


const DB_DIALECT_SQLSERVE='mssql'
const DB_PORT_SQLSERVER=1433
const SQLSERVER_HOST='192.168.1.220'
const SQLSERVER_USER='sa'
const SQLSERVER_PASSWORD='1234'
const SQLSERVER_DB='BI_CLIENTES'

async function getSqlConnection() {
    try {
        const sequelize = new Sequelize(SQLSERVER_DB, SQLSERVER_USER, SQLSERVER_PASSWORD, {
            host: SQLSERVER_HOST,
            port: DB_PORT_SQLSERVER,
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
        const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
            host: POSTGRES_HOST,
            port: DB_PORT_POST,
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
