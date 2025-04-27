export interface IJwtToken {
  sign<T = undefined>(
    payload: object,
    secretOrPrivateKey: string,
    options?: T
  ): string;
  verify<T>(
    token: string,
    secretOrPublicKey: string,
    options?: T
  ): DecodedToken;
}

export type DecodedToken = {
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
};
