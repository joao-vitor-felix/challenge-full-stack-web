import { sign, SignOptions, verify } from "jsonwebtoken";
import { IJwtToken } from "./interfaces/IJwtToken";

export class JwtTokenAdapter implements IJwtToken {
  sign<T = undefined>(
    payload: string | Buffer | object,
    secretOrPrivateKey: string,
    options?: T
  ): string {
    return sign(payload, secretOrPrivateKey, options as SignOptions);
  }
  verify<T = undefined>(
    token: string,
    secretOrPublicKey: string,
    options?: T
  ): string | object | Buffer {
    return verify(token, secretOrPublicKey, options as SignOptions);
  }
}
