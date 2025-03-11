# Kanastra Hiring Challenge

Para iniciar o projeto basta executar o comando:

```
docker-compose up -d
```

- caso não tenha o docker instalado, siga as instruções neste [link](https://docs.docker.com/engine/install/).

Ao subir os containers é necessário verificar se há uma `ACCESS_KEY_ID` e `SECRET_ACCESS_KEY` criada no MinIO. Para cadastrar é bem simples, basta acessar o [MinIO](http://localhost:9001/login) e logar com usuário `kanastra_username` e a senha `kanastra_password`.

## Tecnologias

Para a solução a seguir foram utilizadas as tecnologias de [TypeORM](https://typeorm.io/), [RabbitMQ](https://www.rabbitmq.com/), [PostgreSQL](https://www.postgresql.org/) e [MinIO](https://min.io/).

## Funcionamento

O projeto tem uma gestão de boletos recorrentes, a partir de um upload.

Segue um exemplo de request:

```bash
curl --request POST \
  --url http://localhost:3000/upload \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/upload-example.csv
```

Há dois arquivos `csv` na raiz do projeto, um simples para verificar o funcionamento apenas e outro para u ma demonstração de velocidade de processamento da solução, `upload-example.csv` e `upload-full.csv` respectivamente.

## Fluxo de funcionamento - Upload

1. Após o upload ser efetuado é disparado uma mensagem em uma exchange no RabbitMQ informando deste novo upload. (routingKey `file.uploaded`)
2. Há uma fila esperando este padrão de evento onde busca este arquivo no S3 (MinIO) e via stream realiza o parse do arquivo como um todo. Este processo é responsável por criar grupos de um tamanho especificado nas variáveis de ambiente e publica novamente no RabbitMQ (routingKey `file.process_group.{groupId}`)
3. Há uma fila responsável por pegar este batch de linhas e proceessá-las paralelamente e adiciona-las no banco de dados.

## Fluxo de funcionamento - Pagamento

1. Um CRON diário dispara uma mensagem numa exchange
2. Uma fila aguarda este evento para verificar quais boletos estão vencendo na data atual. Caso haja algum boleto é disparado um evento em uma exchange para realizar o pagamento deste boleto.
3. Há uma fila aguardando este evento que envia a requisição de pagamento e atualiza o banco de dados com o status.

## Testes

O projeto possui cobertura de testes unitários e testes de integração (e2e).

Para executar os testes basta rodar o comando `yarn test` e `yarn test:e2e`.
