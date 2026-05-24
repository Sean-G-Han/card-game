import { useState, useEffect, useContext } from "react";
import apiFetch from "../types/api";
import { UserContext, type UserContextType } from "../context/UserContext";

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
    const {user, setUser} = useContext<UserContextType>(UserContext)

    async function login() {
        const res = await apiFetch<LoginCred, AuthResponse>("POST", "login", { username, password })
        res.tap((tokens) => {
            setUser({
                accessToken: tokens.accessToken
            })
        }).tapError((e) => {
            alert(e || "Login Fail")
        })
    }

    async function register() {
        const res = await apiFetch<LoginCred, AuthResponse>("POST", "register", { username, password })
        res.tap((tokens) => {
            setUser({
                accessToken: tokens.accessToken
            })
        }).tapError((e) => {
            alert(e || "Login Fail")
        })
    }

    useEffect(() => {
        async function refresh() {
            const res = await apiFetch<void, AuthResponse>("POST", "refresh")
            res.tap((tokens) => {
                setUser({
                    accessToken: tokens.accessToken
                })
            })
        }
        
        refresh();
    }, [user, setUser]);

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
            <pre>{user.accessToken}</pre>
        </div>
    );
}