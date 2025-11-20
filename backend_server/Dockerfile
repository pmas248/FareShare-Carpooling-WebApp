FROM node:18-alpine
WORKDIR /app

# copy package.json and lock
COPY package*.json ./

# install deps
RUN npm install

# copy source
COPY . .

# expose server port
EXPOSE 5000

# start server
CMD ["node", "server.js"]
