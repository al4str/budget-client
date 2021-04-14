# Build
FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN cp ./deploy/.env.example ./.env
RUN npm ci --only=production
RUN npm run build
# Run
CMD ["tail", "-f", "/dev/null"]
