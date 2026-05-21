import { ENV } from "../../config/env";

type APIMethod = "POST" | "GET" | "PATCH" | "PUT" | "DELETE"

export default async function apiFetch<T>(method: APIMethod, url: string, body?: T): Promise<Response> {
    return fetch(`${ENV.SERVER_URL}/${url}`, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
    });
}