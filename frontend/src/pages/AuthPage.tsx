import { useState, useEffect } from "react";
import apiFetch from "../types/api";

type LoginCred = {
    username: string,
    password: string
}

type AuthResponse = {
    accessToken: string,
}

export default function AuthPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [accessToken, setAccessToken] = useState("");
    //000 To change. Response is now in result format
    async function login() {
        const res = await apiFetch<LoginCred, AuthResponse>("POST", "login", { username, password })
        res.tap((tokens) => {
            setAccessToken(tokens.accessToken)
        }).tapError((e) => {
            alert(e || "Login Fail")
        })
    }

    async function register() {
        const res = await apiFetch<LoginCred, AuthResponse>("POST", "register", { username, password })
        res.tap((tokens) => {
            setAccessToken(tokens.accessToken)
        }).tapError((e) => {
            alert(e || "Login Fail")
        })
    }

    useEffect(() => {
        async function refresh() {
            const res = await apiFetch<void, AuthResponse>("POST", "refresh")
            res.tap((tokens) => {
                setAccessToken(tokens.accessToken)
            })
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