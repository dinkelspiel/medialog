FROM node:iron
RUN npm install -g pnpm
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
RUN pnpm build
CMD ["pnpm", "start"]
