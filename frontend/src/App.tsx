import { useState } from "react";

const API = "http://localhost:3000";

export default function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [accessToken, setAccessToken] = useState("");

    async function login() {
        const res = await fetch(`${API}/login`, {
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
        const res = await fetch(`${API}/register`, {
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