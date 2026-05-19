import { User } from "./user";

export type TokenPair = {
    accessToken: string,
    refreshToken: string
}

export type AccessTokenPayload = User

export type RefreshTokenPayload = {
    id: string;
};