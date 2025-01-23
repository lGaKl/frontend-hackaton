import Joyride, { CallBackProps, Step } from "react-joyride";
import "./Tutorial.css";

const Tutorial = ({ run, onFinish }: { run: boolean; onFinish: () => void }) => {
    const steps: Step[] = [
        {
            target: ".nav-link-accueil",
            content: "Ce bouton vous ramène à la page d'accueil de l'application, où vous pouvez avoir un aperçu global de votre tableau de bord et accéder rapidement aux principales fonctionnalités.",
        },
        {
            target: ".nav-link-transactions",
            content: "Ce menu déroulant vous permet de gérer toutes vos transactions. Vous pouvez y ajouter de nouvelles opérations financières, consulter la liste des transactions existantes et les exporter au format \"CSV\", ou les mettre à jour si nécessaire.",
        },
        {
            target: ".nav-link-budget",
            content: "Ce lien vous conduit vers la section de gestion de budget, où vous pouvez suivre et ajuster vos dépenses en fonction de vos objectifs financiers.",
        },
        {
            target: ".nav-link-categories",
            content: "Cette section vous permet de gérer les catégories de dépenses. Vous pouvez créer et modifier pour mieux organiser vos finances.",
        },
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        if (["finished", "skipped"].includes(status)) {
            onFinish();
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress={false}
            showSkipButton
            locale={{
                back: "Précédent",
                close: "Fermer",
                last: "Terminer",
                next: "Suivant",
                skip: "Passer",
            }}
            styles={{
                options: {
                    primaryColor: "#146B3A",
                    textColor: "#333333",
                    backgroundColor: "#fefefe",
                    overlayColor: "rgba(0, 0, 0, 0.5)",
                    spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.7)",
                    zIndex: 2000,
                },
                tooltipContainer: {
                    textAlign: "left",
                    fontSize: "16px",
                    lineHeight: "1.6",
                },
                tooltipContent: {
                    padding: "15px 20px",
                },
                tooltipFooter: {
                    justifyContent: "space-between",
                },
                tooltipTitle: {
                    fontSize: "18px",
                    fontWeight: "bold",
                },
                buttonClose: {
                    backgroundColor: "gold",
                    color: "#d32f2f",
                    borderRadius: "50%",
                    fontSize: "12px",
                },
                buttonBack: {
                    backgroundColor: "#146B3A",
                    color: "#fefefe",
                    borderRadius: "5px",
                },
                buttonSkip: {
                    backgroundColor: "#d32f2f",
                    color: "#fefefe",
                    borderRadius: "5px",
                },
            }}
            callback={handleJoyrideCallback}
        />
    );
};

export default Tutorial;
