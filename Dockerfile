# FROM node:alpine as development

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# COPY . . 

# RUN npm run build

# FROM node:alpine as production



# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=prod

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist


# EXPOSE 3000

# CMD ["node", "dist/main"]


FROM node

WORKDIR /app

COPY . . 

RUN npm ci

RUN npm run build

ENV PORT=value

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

