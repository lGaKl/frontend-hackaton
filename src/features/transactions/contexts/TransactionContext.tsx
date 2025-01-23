import { Transaction } from "../types/transaction.ts";
import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { fetchTransactions } from "../services/transaction-service.tsx";
import {fetchBudgetById} from "../../budget/services/BudgetService.tsx";

interface Action {
    type: "set" | "add" | "update" | "delete";
    transaction?: Transaction;
    transactions?: Transaction[];
}

const TransactionContext = createContext<Transaction[]>([]);
const TransactionDispatchContext = createContext<(action: Action) => void>(() => {
    throw new Error("TransactionDispatchContext not initialized!");
});

function reducer(transactions: Transaction[], action: Action) {
    switch (action.type) {
        case "set":
            return action.transactions ?? [];
        case "add":
            return action.transaction ? [...transactions, action.transaction] : transactions;
        case "update":
            return action.transaction
                ? transactions.map(t => (t.id === action.transaction!.id ? action.transaction! : t))
                : transactions;
        case "delete":
            return action.transaction
                ? transactions.filter(t => t.id !== action.transaction!.id)
                : transactions;
        default:
            throw new Error("Unknown action type " + action.type);
    }
}

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, dispatch] = useReducer(reducer, []);

    useEffect(() => {
    const getData = async () => {
        try {
            console.log("Fetching transactions...");
            const transactions = await fetchTransactions();
            console.log("Fetched transactions:", transactions);

            const userId = Number(localStorage.getItem("userId"));
            console.log("User ID:", userId);

            const filteredTransactions = await Promise.all(
                transactions.map(async (transaction) => {
                    const budget = await fetchBudgetById(transaction.budgetId);
                    if (budget && budget.id === userId) {
                        return transaction;
                    }
                    return null;
                })
            );

            console.log("Filtered transactions:", filteredTransactions);
            dispatch({ type: "set", transactions: filteredTransactions.filter(Boolean) });
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };
    getData();
}, []);

    return (
        <TransactionContext.Provider value={transactions}>
            <TransactionDispatchContext.Provider value={dispatch}>
                {children}
            </TransactionDispatchContext.Provider>
        </TransactionContext.Provider>
    );
}

export const useTransactions = () => useContext(TransactionContext);
export const useTransactionDispatch = () => useContext(TransactionDispatchContext);
