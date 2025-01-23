import { useBudgetDispatch } from "../context/BudgetContext.tsx";
//import { Budget } from "../types/Budget.ts";
import { postBudget/*, updateBudget*/ } from "../services/BudgetService.tsx";
//import { debounce } from "../../../shared/utils/Utils.ts";
//import { useLocation } from "react-router-dom";
//import { BudgetPageComponent } from "./BudgetPageComponent.tsx";
import {BudgetCreateCommand} from "../services/commands/BudgetCreateCommand.ts";
import NewBudgetComponent from "./NewBudgetComponent.tsx";

export default function BudgetManagerComponent() {
    const dispatch = useBudgetDispatch();
    //const location = useLocation();

    const onBudgetCreated: (budget: BudgetCreateCommand) => void = budget => {
        const sendBudget = async (budget: BudgetCreateCommand) => {
            try {
                console.log("",budget.total);
                console.log("",budget.dateBudget);
                const budgetCreated = await postBudget({
                    total: budget.total,
                    dateBudget: budget.dateBudget,
                    userId: Number(localStorage.getItem("userId"))
                });
                console.log("ici : ",budgetCreated);
                dispatch({ type: "add", budget: budgetCreated });
            } catch (error) {
                console.error("Error creating budget:", error);
            }
        };
        sendBudget(budget);
    };

    /*const onBudgetUpdated = debounce((budget: Budget) => {
        const sendUpdateBudget = async (budget: Budget) => {
            const response = await updateBudget({
                id: budget.id,
                total: budget.total,
                date_budget: new Date(budget.date_budget).toISOString().split('T')[0]
            });
            if (!response.ok) throw new Error(await response.json());
        };
        sendUpdateBudget(budget);
    }, 500);*/

    /*let content;
    switch (location.pathname) {
        case "/budget":
            content = <BudgetPageComponent />;
            break;
        case "/newBudget":
            content = <NewBudgetComponent onBudgetCreated={onBudgetCreated} />;
            break;
        default:
            content = <div>Page not found</div>;
    }*/

    //return <div>{content}</div>;
    return <>
        <NewBudgetComponent onBudgetCreated={onBudgetCreated} />
    </>
}