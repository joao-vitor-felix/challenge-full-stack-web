export class PasswordHasherAdapterStub {
  async hash(_password: string): Promise<string> {
    return Promise.resolve("hashedPassword");
  }

  async compare(_password: string, _hashedPassword: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
