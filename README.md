# Strapi Richard Willis

[![Analyze](https://github.com/badsyntax/richardwillis.info-strapi/actions/workflows/analyze.yml/badge.svg)](https://github.com/badsyntax/richardwillis.info-strapi/actions/workflows/analyze.yml)
[![Deploy](https://github.com/badsyntax/richardwillis.info-strapi/actions/workflows/deploy.yml/badge.svg)](https://github.com/badsyntax/richardwillis.info-strapi/actions/workflows/deploy.yml)

## Getting Started

Set the following env vars within `.env`:

```bash
HOST=0.0.0.0
ADMIN_JWT_SECRET=somerandomstring

DATABASE_HOST=1.1.1.1
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=password

AWS_ACCESS_KEY_ID=
AWS_ACCESS_SECRET=
AWS_REGION=
AWS_BUCKET=
```

```bash
# When adding new models/content-types
npm run dev

# In production
npm run build
npm start
```

## Build

```bash
docker build -t ghcr.io/badsyntax/richardwillis.info-strapi:latest .
docker run --publish 1337:1337 --volume $(pwd)/.env:/app/.env ghcr.io/badsyntax/richardwillis.info-strapi:latest
docker push ghcr.io/badsyntax/richardwillis.info-strapi:latest
```

Or:

```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/badsyntax/richardwillis.info-strapi:latest --push .
```

## Production

Run the docker image by providing an /app/.env file (eg with docker secrets)
