import { Sequelize } from "sequelize"
import database from "../database/dbSqlServer.js"

export default database.define('acionreals', {
     ID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        CONT_ID: {
            type: Sequelize.INTEGER
        },
        DEVEDOR_ID: {
            type: Sequelize.INTEGER
        },
        ACIONAMENTO_ID: {
            type: Sequelize.INTEGER
        },
        DATA: {
            type: Sequelize.DATE
        },
        ACAO_ID: {
            type: Sequelize.INTEGER
        },
        FONE: {
            type: Sequelize.STRING
        },
        USUARIO_INCLUSAO: {
            type: Sequelize.STRING
        },
        COBRADOR_ID: {
            type: Sequelize.INTEGER
        },
        SE_SMS: {
            type: Sequelize.BOOLEAN
        },
        SE_SMS_LOTE: {
            type: Sequelize.BOOLEAN
        },
        DESCRICAO: {
            type: Sequelize.STRING
        },
        SE_CPC: {
            type: Sequelize.STRING
        },
        DIAS_PERIODO: {
            type: Sequelize.INTEGER
        }
       /* timestamps: false,
        createdAt: false,
        updatedAt: false*/
   },        
   { timestamps: false },
   { createdAt: false },
   { updatedAt: false }
  )
 
