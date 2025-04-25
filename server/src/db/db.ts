import { env } from "@/helpers/env";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  host: env.POSTGRES_HOST,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  port: env.POSTGRES_PORT,
  connectionTimeoutMillis: 2000,
  idleTimeoutMillis: 1000
});
