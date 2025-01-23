import {createContext, ReactNode, useContext, useEffect, useReducer} from "react";
import {Budget} from "../types/Budget.ts";
import {fetchBudgets} from "../services/BudgetService.tsx";

interface Action {
    type: "set" | "add" | "update" | "delete";
    budget: Budget;
    budgets?: Budget[];
}

const BudgetContext = createContext<Budget[]>([]);
const BudgetDispatchContext = createContext<(action: Action) => void>(() => {
    throw new Error("BudgetDispatchContext not initialized!");
});

function reducer(budgets: Budget[], action: Action) {
    switch (action.type) {
        case "set":
            return action.budgets ?? [];
        case "add":
            if (budgets.some(bud => bud.id === action.budget?.id)) {
                return budgets;
            }
            return [...budgets, action.budget];
        case "update":
            return action.budget
                ? budgets.map(b => (b.id === action.budget!.id ? action.budget! : b))
                : budgets;
        case "delete":
            return action.budget
                ? budgets.filter(b => b.id !== action.budget!.id)
                : budgets;
        default:
            throw new Error("Unknown action type " + action.type);
    }
}

export function BudgetProvider({ children }: { children: ReactNode }) {
    const [budgets, dispatch] = useReducer(reducer, []);

    useEffect(() => {
        let isMounted = true;
        const getData = async () => {
            const fetchedBudgets = await fetchBudgets();
            if (isMounted) {
                fetchedBudgets.forEach(budget => {
                    if (!budgets.some(bud => bud.id === budget.id)) {
                        dispatch({ type: "add", budget: budget });
                    }
                });
            }
        };
        getData();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <BudgetContext.Provider value={budgets}>
            <BudgetDispatchContext.Provider value={dispatch}>
                {children}
            </BudgetDispatchContext.Provider>
        </BudgetContext.Provider>
    );
}

export const useBudgets = () => useContext(BudgetContext);
export const useBudgetDispatch = () => useContext(BudgetDispatchContext);
