import { DecodedToken } from "@/adapters/interfaces/IJwtToken";
import { faker } from "@faker-js/faker";
import { SignOptions } from "jsonwebtoken";

export class JwtTokenAdapterStub {
  sign<T = undefined>(
    _payload: object,
    _secretOrPrivateKey: string,
    _options?: T extends undefined ? undefined : SignOptions
  ): string {
    return "stubbedToken";
  }

  verify<T = undefined>(
    _token: string,
    _secretOrPublicKey: string,
    _options?: T extends undefined ? undefined : SignOptions
  ): DecodedToken {
    return {
      sub: "stubbedId",
      exp: faker.number.int(),
      iat: faker.number.int()
    };
  }
}
