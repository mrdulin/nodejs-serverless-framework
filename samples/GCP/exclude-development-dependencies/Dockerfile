FROM mhart/alpine-node:8.7.0

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install

ADD . /app
CMD ["npm", "run", "print"]
