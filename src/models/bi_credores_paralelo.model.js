import { Sequelize } from "sequelize"
import { getPostgresConnection } from '../db.js'

const postgresConnection = await getPostgresConnection()

export default postgresConnection.define('bi_credores', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        CPF: {
            type: Sequelize.STRING(14),
            allowNull: false
        },
        DEVEDOR_ID: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        CONT_ID: {
            type: Sequelize.SMALLINT
        },
        NUMERO_CONTRATO: {
            type: Sequelize.STRING(50)
        },
        ACORDO_ID: {
            type: Sequelize.STRING(9)
        },
        MIN_VENCIMENTO: {
            type: Sequelize.DATE
        },
        MAX_VENCIMENTO: {
            type: Sequelize.DATE
        },
        PLANO: {
            type: Sequelize.SMALLINT
        },
        MIN_PARCELAS: {
            type: Sequelize.SMALLINT
        },
        MAX_PARCELAS: {
            type: Sequelize.SMALLINT
        },
        MAX_ATRASO: {
            type: Sequelize.INTEGER
        },
        TT_PARCELAS: {
            type: Sequelize.INTEGER
        },
        CIDADE: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        UF: {
            type: Sequelize.STRING(2)
        },
        DATA_BATIMENTO: {
            type: Sequelize.DATE
        },
        DATA_INCLUSAO: {
            type: Sequelize.DATE
        },
        DATA_IMPORTACAO: {
            type: Sequelize.DATE
        },
        DATA_VENCIMENTO_ANTIGO: {
            type: Sequelize.DATE
        },
        DATA_ULTIMO_ACIONAMENTO: {
            type: Sequelize.DATE
        },
        DATA_PROXIMO_ACIONAMENTO: {
            type: Sequelize.DATE
        },
        ACAO_ID: {
            type: Sequelize.INTEGER
        },
        SALDO: {
            type: Sequelize.DECIMAL(38, 2)
        },
        SALDO_DEV_TT: {
            type: Sequelize.DECIMAL(38, 2)
        },
        TT_CONTRATOS: {
            type: Sequelize.INTEGER
        },
        CPC: {
            type: Sequelize.INTEGER
        },
        FAIXA_CREDOR: {
            type: Sequelize.STRING(30)
        },
        FAIXA_CREDOR_MJ: {
            type: Sequelize.STRING(30)
        },
        DESCRICAO: {
            type: Sequelize.STRING(50)
        },
        PER_PLANO_PAGO: {
            type: Sequelize.INTEGER
        },
        PNP: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        TOTAL_ESFORCO: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ESFORCO_DISCADOR: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        PISITIVAS: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        NEGATIVAS: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        DATA_BASE: {
            type: Sequelize.DATEONLY
        },
        STATUS: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        PRODUTO_ID: {
            type: Sequelize.STRING(50)
        },
        DATA_ACIONAMENTO_COLCHAO: {
            type: Sequelize.DATE
        }
   },        
   { timestamps: false },
   { createdAt: false },
   { updatedAt: false }
 )