"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const buttonDisabled = !user.email.trim() || !user.password;

    const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            router.push("/Profile");
        } catch (error: unknown) {
            const message = axios.isAxiosError<{ error?: string }>(error)
                ? error.response?.data?.error ?? error.message
                : error instanceof Error
                    ? error.message
                    : "Login failed. Please try again.";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    }

    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>{loading ? "Processing" : "Login"}</h1>
        <hr />
        <form className="flex flex-col" onSubmit={onLogin}>
        <label htmlFor="email">email</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            autoComplete="email"
            required
            />
        <label htmlFor="password">password</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            autoComplete="current-password"
            required
            />
            {errorMessage && (
                <p className="mb-4 text-red-600" role="alert">
                    {errorMessage}
                </p>
            )}
            <button
            disabled={buttonDisabled || loading}
            type="submit"
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50">{loading ? "Processing..." : "Login here"}</button>
        </form>
            <Link href="/Signup">Visit Signup page</Link>
        </div>
    )

}
