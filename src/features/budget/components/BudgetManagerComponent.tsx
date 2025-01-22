import { useBudgetDispatch } from "../BudgetContext.tsx";
import { Budget } from "../types/Budget.ts";
import { postBudget, updateBudget } from "../services/BudgetService.tsx";
import { BudgetCreateCommand } from "../services/commands/BudgetCreateCommand.ts";
import { debounce } from "../../../shared/utils/Utils.ts";
import { useLocation } from "react-router-dom";
import { BudgetPageComponent } from "./BudgetPageComponent.tsx";
import { NewBudgetComponent } from "./NewBudgetComponent.tsx";

export default function BudgetManagerComponent() {
    const dispatch = useBudgetDispatch();
    const location = useLocation();

    const onBudgetCreated = (budget: BudgetCreateCommand) => {
        const sendBudget = async (budget: BudgetCreateCommand) => {
            const budgetCreated = await postBudget({
                total: budget.total,
                date_budget: new Date(budget.date_budget).toISOString().split('T')[0]
            });
            dispatch({ type: "add", budget: budgetCreated });
        };
        sendBudget(budget);
    };

    const onBudgetUpdated = debounce((budget: Budget) => {
        const sendUpdateBudget = async (budget: Budget) => {
            const response = await updateBudget({
                id: budget.id,
                total: budget.total,
                date_budget: new Date(budget.date_budget).toISOString().split('T')[0]
            });
            if (!response.ok) throw new Error(await response.json());
        };
        sendUpdateBudget(budget);
    }, 500);

    let content;
    switch (location.pathname) {
        case "/budget":
            content = <BudgetPageComponent />;
            break;
        case "/budget/newBudget":
            content = <NewBudgetComponent onBudgetCreated={onBudgetCreated} />;
            break;
        default:
            content = <div>Page not found</div>;
    }

    return <div>{content}</div>;
}