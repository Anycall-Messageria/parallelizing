import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

async function getSqlConnection() {
     try {
            const sequelize = new Sequelize(process.env.SQLSERVER_DB, process.env.SQLSERVER_USER, process.env.SQLSERVER_PASSWORD, {
            host: process.env.SQLSERVER_HOST,
            dialect: 'mssql',
                "dialectOptions": {
                options: { "requestTimeout": 300000 }
            },
           });
           return sequelize

    } catch (error) {
        console.error('Error connecting to SQL Server:', error);
        throw error;
    }
}

async function getPostgresConnection() {

   const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
            host: process.env.POSTGRES_HOST,
            dialect: 'postgres',
                "dialectOptions": {
                options: { "requestTimeout": 300000 }
            },
           });
           return sequelize

}

export { getSqlConnection, getPostgresConnection };
