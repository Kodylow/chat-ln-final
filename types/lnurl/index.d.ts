// types/lnurl/index.d.ts
declare module 'lnurl' {
  export function encode(data: string): string;
  export function decode(data: string): string;
  export function verifyAuthorizationSignature(
    sig: string,
    k1: string,
    key: string,
  ): boolean;
}
