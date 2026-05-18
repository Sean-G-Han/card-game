export type TokenPair = {
    accessToken: string,
    refreshToken: string
}

export type AccessTokenPayload = {
    id: string;
    username: string;
};

export type RefreshTokenPayload = {
    id: string;
};