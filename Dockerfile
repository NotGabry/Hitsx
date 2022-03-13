FROM node:16.14.0
WORKDIR /

COPY package.json /
RUN npm i

COPY . /

CMD ["npm", "run", "build"]