import { useState, useEffect } from "react";
import { ENV } from "../../config/env";

export default function AuthPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [accessToken, setAccessToken] = useState("");

    async function login() {
        const res = await fetch(`${ENV.SERVER_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // IMPORTANT for refresh token cookie
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.accessToken) {
            setAccessToken(data.accessToken);
        } else {
            alert(data.error || "Login failed");
        }
    }

    async function register() {
        const res = await fetch(`${ENV.SERVER_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.accessToken) {
            setAccessToken(data.accessToken);
        } else {
            alert(data.error || "Register failed");
        }
    }

    useEffect(() => {
        async function refresh() {
            const res = await fetch(`${ENV.SERVER_URL}/refresh`, {
                method: "POST",
                credentials: "include"
            });

            const data = await res.json();

            if (data.accessToken) {
                setAccessToken(data.accessToken);
            }
        }
        
        refresh();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Login</h1>

            <input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <br />

            <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br />

            <button onClick={login}>Login</button>
            <button onClick={register}>Register</button>

            <hr />

            <h3>Access Token</h3>
            <pre>{accessToken}</pre>
        </div>
    );
}