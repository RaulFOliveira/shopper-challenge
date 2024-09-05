# Shopper Challenge Back-end

Este é o repositório para o desafio técnico back-end proposto pela empresa Shopper.com.br

OBS: Caso você seja algum funcionário da shopper.com.br para testar a aplicação, entre em contato comigo para acrescentar as variáveis de ambiente necessárias além do Gemini. 

Resumidamente, é uma aplicação que recebe uma imagem (base64) de um hidrômetro ou gasômetro e o Google Gemini precisa interpretar o conteúdo dessa imagem e devolve para o usuário para poder atualizar no banco de dados MySQL, posteriormente.

Bibliotecas utilizadas:
- Generative-AI
- Prisma
- AWS SDK
- Base64
- isBase64
- UUID Validate 
- FS-Extra
- Dotenv


# Instalando o projeto

Os requisitos para rodar a aplicação são apenas dois: Node.js e Docker Compose.


Antes de tudo, você precisa criar um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:
 
```
GEMINI_API_KEY=YOUR_API_KEY
AWS_ACCESS_KEY=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_ACCESS_KEY
```

OBS: Tenha um bucket chamado shopper-images-test.

Após isso, abra um terminal na pasta raiz da aplicação e baixe as dependências:

```
npm install
```

Agora rode o container do MySQL no docker compose:

```
docker-compose up -d
```

E para iniciar a aplicação, rode este comando:

```
npm run dev
```