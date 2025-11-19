// frontend/app/login/page.tsx
"use client";

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import "./login.css";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    // Sign-in handler -> this is where admin/admin check happens
    const handleSignIn = (e: FormEvent) => {
        e.preventDefault();

        if (username === "admin" && password === "admin") {
            if (typeof window !== "undefined") {
                window.localStorage.setItem("isAuthenticated", "true");
            }
            router.push("/"); // go to dashboard
        } else {
            setLoginError("Invalid credentials. Try admin / admin.");
        }
    };

    // Sign-up is just visual for now
    const handleSignUp = (e: FormEvent) => {
        e.preventDefault();
        // You can plug real sign-up logic later.
        alert("Sign-up UI only for now 🙂");
    };

    return (
        <div className="login-page">
            {/* Optional title above the card */}
            <h3
                className="
                    login-title
                    text-4xl font-bold italic
                    transition-all duration-300
                    hover:[animation:hover-glow_0.4s_ease-in-out_forwards]">
                Welcome to DailyAIResearch
            </h3>

            <div
                className={
                    "login-container" + (isSignUp ? " right-panel-active" : "")
                }
            >
                {/* SIGN UP PANEL */}
                <div className="login-form-container login-sign-up-container">
                    <form className="login-form" onSubmit={handleSignUp}>
                        <h1>Create Account</h1>
                        <span>Use your email for registration</span>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Name"
                        />
                        <input
                            className="login-input"
                            type="email"
                            placeholder="Email"
                        />
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Password"
                        />
                        <button type="submit" className="login-button">
                            Sign Up
                        </button>
                    </form>
                </div>

                {/* SIGN IN PANEL */}
                <div className="login-form-container login-sign-in-container">
                    <form className="login-form" onSubmit={handleSignIn}>
                        <h1>Sign in</h1>
                        <span>Use admin / admin to enter the app</span>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {loginError && (
                            <p style={{color: "#e11d48", fontSize: 12, marginTop: 8}}>
                                {loginError}
                            </p>
                        )}

                        <button type="submit" className="login-button">
                            Sign In
                        </button>
                    </form>
                </div>

                {/* OVERLAY SIDE */}
                <div className="login-overlay-container">
                    <div className="login-overlay">
                        <div className="login-overlay-panel login-overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>
                                To keep using DailyAIResearch, please sign in with your
                                account.
                            </p>
                            <button
                                className="login-button login-button-ghost"
                                type="button"
                                onClick={() => setIsSignUp(false)}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="login-overlay-panel login-overlay-right">
                            <h1>Hello, Creator!</h1>
                            <p>
                                Start your journey with a daily stream of deep AI research
                                topics.
                            </p>
                            <button
                                className="login-button login-button-ghost"
                                type="button"
                                onClick={() => setIsSignUp(true)}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}