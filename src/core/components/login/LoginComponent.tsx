import { useState, ChangeEvent, FormEvent } from "react";
import "./LoginComponent.css";

export function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError("");
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email && password) {
            try {
                const response = await fetch("http://localhost:8080/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    throw new Error("Login failed");
                }

                const token = await response.text();
                console.log("Logging in with", email, password, "Token:", token);
                window.location.href = "/";
            } catch (error) {
                setError("Login failed. Please try again.");
            }
        } else {
            setError("Please enter both email and password.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Connexion</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn-login">Connexion</button>
            </form>
            <br/>
            Vous n'avez pas encore de compte?<br/>
            <span>Cliquez <a href="/register">ici</a> pour vous enregistrer.</span>
        </div>
    );
}