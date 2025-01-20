import { useEffect, useState } from "react";

// Définition du type User
interface User {
    id: number;
    name: string;
    email: string;
    [key: string]: any; // Permet d'accepter d'autres champs non définis dans User
}

export function HomeComponent() {
    const [user, setUser] = useState<User | null>(null); // Type explicite

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/users/1")
            .then(response => response.json())
            .then((data: User) => {
                console.log("Données récupérées depuis l'API :", data); // Log de toutes les données
                setUser(data);
            })
            .catch(error => console.error("Erreur de requête :", error));
    }, []);

    return (
        <section>
            <h1>Ready for Hackathon?</h1>
            {user ? (
                <div>
                    <h2>{user.name}</h2>
                    <p>Email: {user.email}</p>
                    <pre>{JSON.stringify(user, null, 2)}</pre> {/* Affiche toutes les données */}
                </div>
            ) : (
                <p>Chargement des données...</p>
            )}
        </section>
    );
}
