FROM node:10
WORKDIR /home/quasar/project

COPY . /home/quasar/project

RUN npm install -g @vue/cli
RUN npm install -g @quasar/cli
RUN npm install

EXPOSE 8080