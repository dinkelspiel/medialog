FROM node:iron
RUN npm install -g pnpm@9.1.0
WORKDIR /usr/src/app
RUN ls
SHELL ["/bin/bash", "--login", "-c"]
ENV SHELL bash
COPY . .
RUN mkdir -p /.cache/pnpm/dlx
RUN chmod 777 /.cache/pnpm/dlx/ -R
RUN mkdir -p /usr/src/app/.next/cache/fetch-cache
RUN chmod 777 /usr/src/app/.next/cache -R
RUN chmod 777 /usr/src/app -R
RUN chmod 744 ./prisma/schema.prisma
RUN pnpm install
RUN pnpm dlx prisma generate

ARG GIT_REF
ARG GIT_SHA

ENV GIT_BRANCH=$GIT_REF
ENV GIT_COMMIT=$GIT_SHA

RUN pnpm build
CMD ["pnpm", "start"]
