import {lazy, Suspense} from "react";
import loadingGIF from "../../assets/loading.gif"
/*
Ce fichier implémente un composant React qui utilise Suspense et lazy pour le chargement dynamique des composants.
 */
interface Props {
    importFn: () => Promise<any>;

}

export function SuspenseWrapper({ importFn }: Props) {
        const LazyComponent = lazy(importFn);

    return (
        <Suspense
            fallback={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <img
                        src={loadingGIF}
                        alt="Loading..."
                        style={{ maxWidth: "300px", maxHeight: "300px" }}
                    />
                </div>
            }
        >
            <LazyComponent />
        </Suspense>
    );
    }
