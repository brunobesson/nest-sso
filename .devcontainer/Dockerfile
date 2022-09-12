FROM node:16

RUN mkdir -p /workspace
ADD . /workspace
WORKDIR /workspace

RUN export DEBIAN_FRONTEND=noninteractive
RUN npm i -g @nestjs/cli
RUN npm i -g typeorm

