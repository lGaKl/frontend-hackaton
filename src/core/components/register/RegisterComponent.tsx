import { useState, ChangeEvent, FormEvent } from "react";
import "./RegisterComponent.css";

export function RegisterComponent() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
        setError("");
    };

    const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
        setError("");
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError("");
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError("");
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setError("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (firstName && lastName && email && password && confirmPassword) {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            try {
                const response = await fetch("http://localhost:8080/api/v1/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ firstName, lastName, email, password, role: "USER" })
                });

                if (!response.ok) {
                    throw new Error("Registration failed");
                }

                console.log("Registration successful");
                window.location.href = "/login";
            } catch (error) {
                setError("Registration failed. Please try again.");
            }
        } else {
            setError("Please fill in all fields.");
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Enregistrer</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="firstName">Prénom</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Nom</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={handleLastNameChange}
                        className="form-control"
                    />
                </div>
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmation</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn-register">S'enregistrer</button>
            </form>
            Vous avez déjà un compte?
            <span>Cliquez <a href="/login">ici</a> pour vous connecter.</span>
        </div>
    );
}