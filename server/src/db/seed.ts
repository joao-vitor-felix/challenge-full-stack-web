import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupDatabase = async () => {
  const client = await pool.connect();
  const queryPath = path.resolve(__dirname, "sql/setup.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  await client.query(query);
  client.release();
  console.log("Database setup complete.");
};

setupDatabase();
