export interface IJwtToken {
  sign<T = undefined>(
    payload: string | Buffer | object,
    secretOrPrivateKey: string,
    options?: T
  ): string;
  verify<T>(
    token: string,
    secretOrPublicKey: string,
    options?: T
  ): string | object | Buffer;
}
