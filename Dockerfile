FROM node:24-alpine AS build
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN corepack enable
RUN --mount=type=secret,id=GITHUB_TOKEN,env=GITHUB_TOKEN \
    pnpm fetch
RUN pnpm install --offline --frozen-lockfile
COPY . .
ARG VERSION=0.0.0
RUN echo "export const VERSION = '${VERSION}';" > src/app/version.ts
RUN pnpm run build --configuration production
FROM nginx:1
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/squirrelli/browser ./
COPY nginx.conf /etc/nginx/nginx.conf
