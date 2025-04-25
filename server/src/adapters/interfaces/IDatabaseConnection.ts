export interface IDatabaseConnection {
  query<T = any>(query: string, params?: any[]): Promise<T[]>;
}
