FROM node:24-alpine AS build
WORKDIR /usr/src/app
EXPOSE 80
ARG VERSION=0.0.0
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN echo "export const VERSION = '${VERSION}';" > src/app/version.ts
RUN npm run build -c production
FROM nginx:1
COPY --from=build /usr/src/app/dist/penny/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
