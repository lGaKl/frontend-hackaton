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
        setError(""); // Réinitialise l'erreur si l'utilisateur commence à taper
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError(""); // Réinitialise l'erreur si l'utilisateur commence à taper
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le rechargement de la page
        console.log("Form submitted with:", { email, password });

        if (!email || !password) {
            setError("Veuillez entrer votre email et mot de passe.");
            return;
        }

        try {
            // Envoi des données à l'API
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            console.log("API Response:", response);

            if (!response.ok) {
                throw new Error("Échec de la connexion. Vérifiez vos informations.");
            }

            const token = await response.text(); // Récupération du token
            console.log("Logging in with", email, password, "Token:", token);

            toast.success("Connexion réussie !");
            login(token); // Met à jour l'état global dans AuthContext
            navigate("/home"); // Redirection vers la page d'accueil
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            setError("Échec de la connexion. Veuillez réessayer.");
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
                    />
                </div>
                <button type="submit" className="btn-login">
                    Connexion
                </button>
            </form>
            <br />
            Vous n'avez pas encore de compte ?<br />
            <span>
                Cliquez <a href="/register">ici</a> pour vous enregistrer.
            </span>
        </div>
    );
}
