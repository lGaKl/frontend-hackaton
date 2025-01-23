import { Route } from "react-router";
import { SuspenseWrapper } from "../../shared/utils/SuspenseWrapper.tsx";
import { BudgetLayout } from "./layout/BudgetLayout.tsx";

export default [
    <Route path="budget" key="budget" element={<BudgetLayout/>}>
        <Route path="manager" element={
            <SuspenseWrapper key="budget-manager" importFn={() => import("./components/BudgetPageComponent.tsx")}/>
        }/>

        <Route path="newBudget" element={
            <SuspenseWrapper key="budget-add" importFn={() => import("./components/BudgetManagerComponent.tsx")}/>
        }/>
    </Route>
];