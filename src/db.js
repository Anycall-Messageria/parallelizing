import { Sequelize } from 'sequelize'

async function getSqlConnection() {
     try {
            const sequelize = new Sequelize('BI_CLIENTES', 'sa', '1234', {
            host: '192.168.1.220',
            dialect: 'mssql',
                "dialectOptions": {
                options: { "requestTimeout": 300000 }
            },
           });
           return sequelize

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function getPostgresConnection() {

   const sequelize = new Sequelize('BI_CLIENTES', 'postgres', '1977@30@04', {
            host: '144.91.80.153',
            dialect: 'postgres',
                "dialectOptions": {
                options: { "requestTimeout": 300000 }
            },
           });
           return sequelize

    /*
    return {
        client,
        students: {
            async insert(person) {
                const { name, email, age, registeredAt } = person;
                const query = 'INSERT INTO students (name, email, age, registered_at) VALUES ($1, $2, $3, $4)';
                const values = [name, email, age, registeredAt];

                await client.query(query, values);

            },
            async list(limit = 100) {
                const query = 'SELECT * FROM students LIMIT $1';
                const values = [limit];

                const result = await client.query(query, values);
                return result.rows;

            },
            async count() {
                const query = 'SELECT COUNT(*) as total FROM students';

                const result = await client.query(query);
                return Number(result.rows[0].total);

            },
            async deleteAll() {
                const query = 'DELETE FROM students';

                await client.query(query);
            },
            async createTable() {
                const createStudentsTableQuery = `
                        CREATE TABLE IF NOT EXISTS students (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            email VARCHAR(255) NOT NULL,
                            age INT NOT NULL,
                            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )`;
                await client.query(createStudentsTableQuery);

            }
        }
    };
    */
}

export { getSqlConnection, getPostgresConnection };
