/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { PrismaClient } from '@/prisma/generated/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { createPool, Pool } from 'mariadb';

// Create a connection pool manually for more control
const pool: Pool = createPool({
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  host: process.env.DATABASE_HOST,
  port: 3306,
  connectionLimit: 20,
  acquireTimeout: 30000,
  idleTimeout: 60000,
});

// Pass the pool to the adapter
const adapter = new PrismaMariaDb(pool as any);

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
