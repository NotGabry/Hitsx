FROM node:16.14.0
WORKDIR /

COPY package.json /
RUN npm install

COPY . /

CMD ["tsc", "&&", "node", "main.js"]