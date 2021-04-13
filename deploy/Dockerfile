# Build
FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN apk add --no-cache python make g++
RUN cp ./deploy/.env.example ./.env
RUN npm ci
RUN npm run build
# Run
CMD ["tail", "-f", "/dev/null"]
