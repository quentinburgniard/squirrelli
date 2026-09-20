# Squirrelli

## Local development

Use Node.js 24, then install dependencies with pnpm:

```sh
corepack enable
pnpm install --frozen-lockfile
```

The `@quentinburgniard/api-models` package is hosted on GitHub Packages. Configure its scope registry and a read token for `npm.pkg.github.com` in your user-level npm config.

### 1. Set up the proxy

Copy `proxy.conf.json.example` to `proxy.conf.json`, then update the API target and optional bearer token for your local environment.
