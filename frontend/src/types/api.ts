import { ENV } from "../../config/env";
import { Result } from "./result";

type APIMethod = "POST" | "GET" | "PATCH" | "PUT" | "DELETE"

export default async function apiFetch<TBody, TResponse>(method: APIMethod, url: string, body?: TBody): Promise<Result<TResponse>> {
    try {
        const res = await fetch(`${ENV.SERVER_URL}/${url}`, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: body ? JSON.stringify(body) : undefined
        });

        if (!res.ok) {
            const errorText = await res.text();
            return Result.failure(errorText || `HTTP error ${res.status}`);
        }

        const data = (await res.json()) as TResponse;

        return Result.success(data);

    } catch {
        return Result.failure("Network error");
    }
}