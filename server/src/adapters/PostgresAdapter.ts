import { Pool } from "pg";
import { IDatabaseConnection } from "./interfaces/IDatabaseConnection";

export class PostgresAdapter implements IDatabaseConnection {
  constructor(private pool: Pool) {}

  async query(query: string, params?: any[]) {
    const result = await this.pool.query(query, params);
    return result.rows;
  }
}
