import BiCredoresParalelo from './src/models/bi_credores_paralelo.model.js'
import ResumoFaixasParalelo from './src/models/resumo_faixas_paralelo.model.js'

console.log('🏗️  Criando tabelas no PostgreSQL...')

try {
    console.log('📋 Criando tabela bi_credores...')
    await BiCredoresParalelo.sync({ force: true })
    console.log('✅ Tabela bi_credores criada!')
    
    console.log('📋 Criando tabela resumo_faixas...')
    await ResumoFaixasParalelo.sync({ force: true })
    console.log('✅ Tabela resumo_faixas criada!')
    
    console.log('🎉 Todas as tabelas criadas com sucesso!')
    process.exit(0)
    
} catch (error) {
    console.error('❌ Erro criando tabelas:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
}