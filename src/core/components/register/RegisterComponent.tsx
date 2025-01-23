import { useState, ChangeEvent, FormEvent } from "react";
import "./RegisterComponent.css";
import {toast} from "react-toastify";

export function RegisterComponent() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);

    };

    const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);

    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);

    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);

    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);

    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: { email: string; password: string; confirmPassword: string } = {
            email: "",
            password: "",
            confirmPassword: "",
        };
        //mail bien écrit
        const mailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!mailRegex.test(email)) {
            newErrors.email = "Mauvais format du mail.";
            console.log(newErrors.email);
        }
        //mdp bien sécurisé
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (!passwordRegex.test(password) || password.length < 12) {
            newErrors.password = "Le mot de passe doit contenir une majuscule, un chiffre, un caractère spécial et 12caratéres.";
            console.log(newErrors.password);
        }
        //mdp le même
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Les mots de passes ne correspondent pas.";
        }
        if (Object.keys(newErrors).length>0) {
            setError(newErrors);
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
                toast.success("Enregistrement réussi !");
                window.location.href = "/login";
            } catch (error) {
                toast.error("Une erreur est survenue lors de l'inscription.");
            }

    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Enregistrer</h2>
                <div className="form-group">
                    <label htmlFor="firstName">Prénom</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        className="form-control"
                        required
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
                        required
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
                        required
                    />
                    {error.email && <p className="error">{error.email}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-control"
                        required
                    />
                    {error.password && <p className="error">{error.password}</p>}
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
                    {error.confirmPassword && <p className="error">{error.confirmPassword}</p>}
                </div>
                <button type="submit" className="btn-register">S'enregistrer</button>
            </form>
            Vous avez déjà un compte?
            <span>Cliquez <a href="/login">ici</a> pour vous connecter.</span>
        </div>
    );
}