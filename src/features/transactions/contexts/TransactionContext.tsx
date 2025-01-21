import { Transaction } from "../types/transaction.ts";
import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { fetchTransactions } from "../services/transaction-service.tsx";

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
            return action.transactions ?? []; // Assure que ce soit un tableau valide
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
                const transactions = await fetchTransactions();
                console.log("Transactions récupérées :", transactions); // ✅ Log des données récupérées
                dispatch({ type: "set", transactions });
            } catch (error) {
                console.error("Erreur lors de la récupération des transactions :", error);
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
