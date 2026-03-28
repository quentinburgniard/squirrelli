FROM node:22-alpine AS build
ENV NODE_ENV=production
WORKDIR /usr/src/app
EXPOSE 80
ARG VERSION=0.0.0
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN echo "export const VERSION = '${VERSION}';" > src/app/version.ts
RUN npm run build -c production
FROM nginx:1
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/squirrelli/browser ./
COPY nginx.conf /etc/nginx/nginx.conf
