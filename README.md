# Paralelizando operações do Node.js com processo filho

Exemplo de [como migrar 1 milhão de itens do Sql Server para o Postgres em apenas alguns minutos](https://youtu.be/EnK8-x8L9TY) usando processo filho do Node.js

## Executando
npm start

## Erros?

Caso receba um erro de muitos processos abertos, tente diminuir a variável const [CLUSTER_SIZE](https://github.com/ErickWendel/parallelizing-nodejs-ops/blob/main/src/index.js#L8C1-L8C24)