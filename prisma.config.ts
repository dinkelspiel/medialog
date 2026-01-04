import dotenv from 'dotenv'
import path from 'path';
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

dotenv.config({ path: path.resolve(".env") });

export default {
  schema: "prisma/schema.prisma",
  datasource: { 
    url: env("DATABASE_URL") 
  }
} satisfies PrismaConfig;
