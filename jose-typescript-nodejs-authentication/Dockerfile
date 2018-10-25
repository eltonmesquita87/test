FROM node:8

ADD --chown=node . /opt/youse

WORKDIR /opt/youse
USER node

ENV LC_ALL en_US.UTF-8

RUN npm install
RUN npm run build_typescript

EXPOSE 8080 8081


ENTRYPOINT ["/opt/youse/entrypoint.sh"]

CMD ["npm", "run", "server"]
