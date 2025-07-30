FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta
EXPOSE 3000

# Usa ts-node diretamente
CMD ["npx", "ts-node", "src/index.ts"]
