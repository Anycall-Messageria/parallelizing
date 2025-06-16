import { Sequelize } from "sequelize"
import { getSqlConnection } from './db.js'


export default getSqlConnection.define('resumo_faixas', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        CONT_ID: {
            type: Sequelize.SMALLINT
        },
        CREDOR: {
            type: Sequelize.STRING(30)
        },
        FAIXA_CREDOR: {
            type: Sequelize.STRING(30)
        },
        FAIXA_CREDOR_MJ: {
            type: Sequelize.STRING(30)
        },
        FX_PLANOPG: {
            type: Sequelize.STRING(20)
        },
        FX_DEBITO: {
            type: Sequelize.STRING(30)
        },
        FX_DEBITO_TOTAL: {
            type: Sequelize.STRING(30)
        },
        FX_CONT: {
            type: Sequelize.STRING(20)
        },
        tipo_pnp: {
            type: Sequelize.STRING(10)
        },
        FX_PLANO: {
            type: Sequelize.STRING(20)
        },
        FX_PARC: {
            type: Sequelize.STRING(30)
        },
        DESC_STATUS: {
            type: Sequelize.STRING(20)
        },
        FX_DEFASAGEM: {
            type: Sequelize.STRING(20)
        },
        TOTAL_CONTRATO: {
            type: Sequelize.INTEGER
        },
        SALDO_CONTRATO: {
            type: Sequelize.DECIMAL(38, 2)
        },
        DATA_BASE: {
            type: Sequelize.STRING(10)
        },
        STATUS: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
   },        
   { timestamps: false },
   { createdAt: false },
   { updatedAt: false }
 )