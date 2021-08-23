FROM node:14.17.3-alpine as base

FROM base AS builder

WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV CI true

COPY package.json package-lock.json ./

RUN npm ci
COPY . .

RUN NODE_ENV=production npm run build
# RUN npm prune --production

FROM base

LABEL maintainer=willis.rh@gmail.com
LABEL org.opencontainers.image.source=https://github.com/badsyntax/richardwillis.info-strapi
LABEL org.label-schema.name="strapi"
LABEL org.label-schema.description="Strapi image for Richard Willis"
LABEL org.label-schema.vcs-url="https://github.com/badsyntax/richardwillis.info-strapi"
LABEL org.label-schema.usage="README.md"
LABEL org.label-schema.vendor="badsyntax"

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 3000
ENV APP_HOME /app

RUN mkdir -p $APP_HOME && chown -R node:node $APP_HOME
WORKDIR $APP_HOME

COPY --from=builder --chown=node:node $APP_HOME/package.json $APP_HOME/package.json
COPY --from=builder --chown=node:node $APP_HOME/node_modules $APP_HOME/node_modules
COPY --from=builder --chown=node:node $APP_HOME/api $APP_HOME/api
COPY --from=builder --chown=node:node $APP_HOME/build $APP_HOME/build
COPY --from=builder --chown=node:node $APP_HOME/components $APP_HOME/components
COPY --from=builder --chown=node:node $APP_HOME/config $APP_HOME/config
COPY --from=builder --chown=node:node $APP_HOME/data $APP_HOME/data
COPY --from=builder --chown=node:node $APP_HOME/extensions $APP_HOME/extensions
COPY --from=builder --chown=node:node $APP_HOME/public $APP_HOME/public
COPY --from=builder --chown=node:node $APP_HOME/favicon.ico $APP_HOME/favicon.ico

USER node

CMD ["npm", "start"]
