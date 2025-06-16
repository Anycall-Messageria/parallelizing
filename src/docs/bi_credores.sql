USE [BI_CLIENTES]
GO

/****** Object:  Table [dbo].[BI_CREDORES]    Script Date: 16/06/2025 12:29:49 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[BI_CREDORES](
	[CPF] [varchar](14) NOT NULL,
	[DEVEDOR_ID] [bigint] NOT NULL,
	[CONT_ID] [smallint] NULL,
	[NUMERO_CONTRATO] [varchar](50) NULL,
	[ACORDO_ID] [varchar](9) NULL,
	[MIN_VENCIMENTO] [smalldatetime] NULL,
	[MAX_VENCIMENTO] [smalldatetime] NULL,
	[PLANO] [smallint] NULL,
	[MIN_PARCELAS] [smallint] NULL,
	[MAX_PARCELAS] [smallint] NULL,
	[MAX_ATRASO] [int] NULL,
	[TT_PARCELAS] [int] NULL,
	[CIDADE] [varchar](30) NOT NULL,
	[UF] [varchar](2) NULL,
	[DATA_BATIMENTO] [smalldatetime] NULL,
	[DATA_INCLUSAO] [smalldatetime] NULL,
	[DATA_IMPORTACAO] [datetime] NULL,
	[DATA_VENCIMENTO_ANTIGO] [smalldatetime] NULL,
	[DATA_ULTIMO_ACIONAMENTO] [datetime] NULL,
	[DATA_PROXIMO_ACIONAMENTO] [datetime] NULL,
	[ACAO_ID] [int] NULL,
	[SALDO] [numeric](38, 2) NULL,
	[SALDO_DEV_TT] [numeric](38, 2) NULL,
	[TT_CONTRATOS] [int] NULL,
	[CPC] [int] NULL,
	[FAIXA_CREDOR] [varchar](30) NULL,
	[FAIXA_CREDOR_MJ] [varchar](30) NULL,
	[DESCRICAO] [varchar](50) NULL,
	[PER_PLANO_PAGO] [int] NULL,
	[PNP] [int] NOT NULL,
	[TOTAL_ESFORCO] [int] NOT NULL,
	[ESFORCO_DISCADOR] [int] NOT NULL,
	[PISITIVAS] [int] NOT NULL,
	[NEGATIVAS] [int] NOT NULL,
	[DATA_BASE] [date] NULL,
	[STATUS] [int] NULL DEFAULT ((1)),
	[PRODUTO_ID] [varchar](50) NULL,
	[DATA_ACIONAMENTO_COLCHAO] [datetime] NULL
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


