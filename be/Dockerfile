FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

# Install PM2
RUN npm install pm2 -g
RUN npm i ts-node
# Bundle app source
COPY . .
RUN npm install -g @nestjs/cli
RUN nest build



EXPOSE 3120
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
