# --- Base node ---
FROM node:11.15.0 as base

MAINTAINER Daniel Mulvad <daniel.mulvad@greenwavesystems.com>

# Install app dependencies
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 51819

CMD ["npm", "run", "prod"]
