# Build
FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN apk add --no-cache python make g++ \
  && cp ./deploy/.env.example ./.env \
  && npm ci --only=production \
  && npm run build
# Run
CMD ["tail", "-f", "/dev/null"]
