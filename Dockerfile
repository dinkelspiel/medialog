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
RUN pnpm dlx prisma db push
RUN apt-get update && apt-get install -y git && apt-get clean
RUN export GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
RUN export GIT_COMMIT=$(git rev-parse --short HEAD)
RUN rm -rf .git
RUN pnpm build
CMD ["pnpm", "start"]
