import { useState, ChangeEvent, FormEvent } from "react";
import "./LoginComponent.css";
import { useAuth } from "../../../features/auth/AuthContext.tsx";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

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
                document.cookie = `token=${token}; path=/`;

                // Fetch user info by email
                const userResponse = await fetch(`http://localhost:8080/api/v1/users/email/${encodeURIComponent(email)}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user info");
                }

                const user = await userResponse.json();
                localStorage.setItem("userId", user.id);

                console.log("Logging in with", email, password, "Token:", token);
                toast.success("Connexion réussie !");
                login(token);
                navigate("/");

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
                        placeholder="Votre email"
                        required
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
                        placeholder="Votre mot de passe"
                        required
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
