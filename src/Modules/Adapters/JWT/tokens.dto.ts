export type accessTokenPayload = {
  userId: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
};

export type refreshTokenPayload = accessTokenPayload & {
  deviceId: string;
};
