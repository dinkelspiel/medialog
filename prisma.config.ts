import 'dotenv/config'
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

export default {
  schema: "prisma/schema.prisma",
  datasource: { 
    url: process.env.DATABASE_URL
  }
} satisfies PrismaConfig;
