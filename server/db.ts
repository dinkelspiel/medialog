/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { PrismaClient } from '@/prisma/generated/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const connectionString = `mariadb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}:3306/${process.env.DATABASE_NAME}?allowPublicKeyRetrieval=true`;

const adapter = new PrismaMariaDb(connectionString);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma: PrismaClient = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
