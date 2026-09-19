FROM --platform=$BUILDPLATFORM node:24-alpine AS build
WORKDIR /usr/src/app
EXPOSE 80
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=GITHUB_TOKEN,env=GITHUB_TOKEN npm ci
COPY . .
ARG VERSION=0.0.0
RUN echo "export const VERSION = '${VERSION}';" > src/app/version.ts
RUN npm run build -c production
FROM nginx:1
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/squirrelli/browser ./
COPY nginx.conf /etc/nginx/nginx.conf
