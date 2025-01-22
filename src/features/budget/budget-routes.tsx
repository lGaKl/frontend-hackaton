import { Route, Routes } from "react-router";
import { SuspenseWrapper } from "../../shared/utils/SuspenseWrapper.tsx";
import { BudgetLayout } from "./layout/BudgetLayout.tsx";

export default function BudgetRoutes() {
    return (
        <Routes>
            <Route path="/" element={<BudgetLayout />}>
                <Route index element={<SuspenseWrapper importFn={() => import("./components/BudgetPageComponent.tsx")} />} />
                <Route path="newBudget" element={<SuspenseWrapper importFn={() => import("./components/NewBudgetComponent.tsx")} />} />
            </Route>
        </Routes>
    );
}