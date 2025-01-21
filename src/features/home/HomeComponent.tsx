import "./HomeComponent.css";

export function HomeComponent() {
    return <>
        <h1 className="home-title">Bienvenue</h1>
        <div className="home-content">
            <section className="feature-section">
                <h2 className="feature-title">Fonctionnalités</h2>
                <div className="feature-list">
                    <div className="feature-item">
                        <strong className="feature-name">🧾Transaction :</strong><br/> Permet d'ajouter, mettre à jour et supprimer une transaction.
                    </div>
                    <div className="feature-item">
                        <strong className="feature-name">💰Budget :</strong><br/> Permet de gérer le budget, y compris la création, la mise à jour et le suivi des dépenses.
                    </div>
                    <div className="feature-item">
                        <strong className="feature-name">🔖Catégories :</strong><br/> Permet d'ajouter et de lister les catégories pour mieux organiser vos transactions et budgets.
                    </div>
                </div>
            </section>
        </div>
    </>
}

/*interface User {
    id: number;
    name: string;
    email: string;
    [key: string]: any;
}

export function HomeComponent() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/users/1")
            .then(response => response.json())
            .then((data: User) => {
                console.log("Données récupérées depuis l'API :", data);
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
                    <pre>{JSON.stringify(user, null, 2)}</pre> {}
                </div>
            ) : (
                <p>Chargement des données...</p>
            )}
        </section>
    );
}*/