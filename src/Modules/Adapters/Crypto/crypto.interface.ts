export interface ICrypto {
  toHash(data: string): Promise<string>;
  compareHash(password: string, passHash: string): Promise<boolean>;
}

export const CRYPTO_SYMBOL = Symbol('ICrypto');
