# Shopper Challenge Back-end

Este é o repositório para o desafio técnico back-end proposto pela empresa Shopper.com.br

Resumidamente, é uma aplicação Nest.js que recebe uma imagem (base64) de um hidrômetro ou gasômetro e o Google Gemini precisa interpretar o conteúdo dessa imagem e devolve para o usuário para poder atualizar no banco de dados PostgreSQL, posteriormente.

Bibliotecas utilizadas:
- Generative-AI
- Prisma
- Class-Validator
- AWS SDK
- FS-Extra
- Dotenv


# Instalando o projeto

Os requisitos para rodar a aplicação são apenas três: Node.js, Docker Compose e ter o AWS CLI na sua máquina, e claro, uma conta na AWS para usufruir o S3, que é um serviço de armazenamento de objetos como, por exemplo, imagens. 


Antes de tudo, você precisa criar um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:
 
```
DB_USER="YOUR_DB_USER"
DB_PASSWORD="YOUR_DB_PASSWORD"
DB_NAME="YOUR_DB_NAME"
GEMINI_API_KEY=YOUR_API_KEY
BUCKET_NAME="YOUR_BUCKET_NAME"
AWS_ACCESS_KEY=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_ACCESS_KEY
```

Para rodar a aplicação juntamente com o banco de dados, use este comando no seu terminal:

```
docker-compose up -d
```
