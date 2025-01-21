import "./HomeComponent.css";

export function HomeComponent() {
    const snowflakes = Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="snowflake">
            <div className="inner">❅</div>
        </div>
    ));
  
    return (
        <>
            <h1 className="home-title">Bienvenue</h1>
            <div className="home-content">
                <section className="feature-section">
                    <h2 className="feature-title">Fonctionnalités</h2>
                    <div className="feature-list">
                        <div className="feature-item">
                            <strong className="feature-name">🧾Transaction :</strong><br /> Permet d'ajouter, mettre à jour et supprimer une transaction.
                        </div>
                        <div className="feature-item">
                            <strong className="feature-name">💰Budget :</strong><br /> Permet de gérer le budget, y compris la création, la mise à jour et le suivi des dépenses.
                        </div>
                        <div className="feature-item">
                            <strong className="feature-name">🔖Catégories :</strong><br /> Permet d'ajouter et de lister les catégories pour mieux organiser vos transactions et budgets.
                        </div>
                    </div>
                </section>
            </div>

            <div className="snowflakes" aria-hidden="true">
                {snowflakes}
            </div>
        </>
    );
}