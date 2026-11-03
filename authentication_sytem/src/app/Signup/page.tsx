"use client"
import Link from "next/link"
import React from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const buttonDisabled =
        !user.email.trim() || !user.password || !user.username.trim();

    const onSignup = async () => {
        setErrorMessage("");

        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            router.push("/login");
        } catch (error: unknown) {
            const message = axios.isAxiosError<{ error?: string }>(error)
                ? error.response?.data?.error ?? error.message
                : error instanceof Error
                    ? error.message
                    : "Signup failed. Please try again.";

            setErrorMessage(message);
        }finally {
            setLoading(false);
        }
    }

     return (
       <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>{loading ? "Processing" : "Signup"}</h1>
        <hr /> 


        <label htmlFor="username">username</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({...user, username: e.target.value})}
            placeholder="username"
            autoComplete="username"
            />


        <label htmlFor="email">email</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            autoComplete="email"
            />


        <label htmlFor="password">password</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            autoComplete="new-password"
            />

            {errorMessage && (
                <p role="alert" className="mb-4 text-red-600">
                    {errorMessage}
                </p>
            )}

            <button
            onClick={onSignup}
            disabled={buttonDisabled || loading}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">{buttonDisabled ? "No signup" : "Signup"}</button>
            <Link href="/login">Visit login page</Link>


        </div>

    )

}