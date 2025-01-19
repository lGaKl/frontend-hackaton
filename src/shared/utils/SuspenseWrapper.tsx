import {lazy, Suspense} from "react";

/*
Ce fichier implémente un composant React qui utilise Suspense et lazy pour le chargement dynamique des composants.
 */
interface Props {
    importFn: () => Promise<any>;
}

export function SuspenseWrapper({importFn}: Props) {
    const LazyComponent = lazy(importFn);

    return <Suspense fallback="loading...">
        <LazyComponent />
    </Suspense>
}