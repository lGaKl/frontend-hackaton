import { Route } from "react-router";
import { SuspenseWrapper } from "../../shared/utils/SuspenseWrapper.tsx";
import { BudgetLayout } from "./layout/BudgetLayout.tsx";

export default [
    <Route path="/" key="budgets" element={<BudgetLayout/>}>
        <Route path="budget" element={
            <SuspenseWrapper key="budget-manager" importFn={() => import("./components/BudgetPageComponent.tsx")}/>
        }/>

        <Route path="newBudget" element={
            <SuspenseWrapper key="budget-add" importFn={() => import("./components/NewBudgetComponent.tsx")}/>
        }/>
    </Route>
];