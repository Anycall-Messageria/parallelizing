import { getPostgresConnection } from './src/db.js'

console.log('🔧 Criando dados de teste simples...')

try {
    const postgres = await getPostgresConnection()
    
    // Criar tabela temporária de origem
    await postgres.query(`
        CREATE TABLE IF NOT EXISTS bi_credores_origem (
            id SERIAL PRIMARY KEY,
            CPF VARCHAR(14) NOT NULL,
            DEVEDOR_ID BIGINT NOT NULL,
            CONT_ID SMALLINT,
            CIDADE VARCHAR(30) NOT NULL,
            STATUS INTEGER DEFAULT 1
        )
    `)
    
    // Limpar dados existentes
    await postgres.query('DELETE FROM bi_credores_origem')
    
    console.log('📊 Inserindo 1.000 registros de teste...')
    
    for (let i = 1; i <= 1000; i++) {
        await postgres.query(`
            INSERT INTO bi_credores_origem (
                CPF, DEVEDOR_ID, CONT_ID, CIDADE, STATUS, 
                PNP, TOTAL_ESFORCO, ESFORCO_DISCADOR, PISITIVAS, NEGATIVAS
            ) 
            VALUES (
                '${String(i).padStart(11, '0')}', 
                ${i}, 
                ${i % 100 + 1}, 
                'Cidade${i}', 
                1,
                0, 0, 0, 0, 0
            )
        `)
        
        if (i % 100 === 0) {
            console.log(`✅ ${i} registros inseridos`)
        }
    }
    
    const [result] = await postgres.query('SELECT COUNT(*) as total FROM bi_credores_origem')
    console.log(`🎉 Total de ${result[0].total} registros criados!`)
    
    await postgres.close()
    
} catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
}