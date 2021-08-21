# Strapi Richard Willis

## Getting Started

Set the following env vars within `.env`:

```bash
HOST=0.0.0.0
STRAPI_DATABASE_HOST=192.168.1.123
STRAPI_DATABASE_PORT=5432
STRAPI_DATABASE_NAME=strapi-thirlby-village
STRAPI_DATABASE_USERNAME=strapi
STRAPI_DATABASE_PASSWORD=strapi
STRAPI_ADMIN_JWT_SECRET=somerandomstring
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
