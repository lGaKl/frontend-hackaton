import {createContext, ReactNode, useContext, useEffect, useReducer} from "react";
import {Budget} from "./types/Budget.ts";
import {fetchBudgets} from "./services/BudgetService.tsx";

interface Action {
    type: "set" | "add" | "update" | "delete";
    budget?: Budget;
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
            return action.budget ? [...budgets, action.budget] : budgets;
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
        const getData = async () => {
            try {
                const budgets = await fetchBudgets();
                console.log("Budgets récupérées :", budgets);
                dispatch({ type: "set", budgets });
            } catch (error) {
                console.error("Erreur lors de la récupération des budgets :", error);
            }
        };
        getData();
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
