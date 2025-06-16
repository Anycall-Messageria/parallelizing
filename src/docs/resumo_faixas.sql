USE [BI_CLIENTES]
GO

/****** Object:  Table [dbo].[RESUMO_FAIXAS]    Script Date: 16/06/2025 12:31:51 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[RESUMO_FAIXAS](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[CONT_ID] [smallint] NULL,
	[CREDOR] [varchar](30) NULL,
	[FAIXA_CREDOR] [varchar](30) NULL,
	[FAIXA_CREDOR_MJ] [varchar](30) NULL,
	[FX_PLANOPG] [varchar](20) NULL,
	[FX_DEBITO] [varchar](30) NULL,
	[FX_DEBITO_TOTAL] [varchar](30) NULL,
	[FX_CONT] [varchar](20) NULL,
	[tipo_pnp] [varchar](10) NULL,
	[FX_PLANO] [varchar](20) NULL,
	[FX_PARC] [varchar](30) NULL,
	[DESC_STATUS] [varchar](20) NULL,
	[FX_DEFASAGEM] [varchar](20) NULL,
	[TOTAL_CONTRATO] [int] NULL,
	[SALDO_CONTRATO] [numeric](38, 2) NULL,
	[DATA_BASE] [varchar](10) NULL,
	[STATUS] [int] NOT NULL
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


