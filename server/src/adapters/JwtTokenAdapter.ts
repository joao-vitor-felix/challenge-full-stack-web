import { sign, SignOptions, verify } from "jsonwebtoken";
import { DecodedToken, IJwtToken } from "./interfaces/IJwtToken";

export class JwtTokenAdapter implements IJwtToken {
  sign<T = undefined>(
    payload: object,
    secretOrPrivateKey: string,
    options?: T extends undefined ? undefined : SignOptions
  ): string {
    return sign(payload, secretOrPrivateKey, options);
  }

  verify<T = undefined>(
    token: string,
    secretOrPublicKey: string,
    options?: T extends undefined ? undefined : SignOptions
  ): DecodedToken {
    const decoded = verify(token, secretOrPublicKey, options);
    return decoded as DecodedToken;
  }
}
