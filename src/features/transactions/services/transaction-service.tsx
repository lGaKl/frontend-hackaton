import { TransactionCreateCommand } from "./commands/transaction-create-command.ts";
import { Transaction } from "../types/transaction.ts";
import { TransactionUpdateCommand } from "./commands/transaction-update-command.ts";

const TRANSACTION_API_URL = import.meta.env.VITE_API_URL + "/transactions";

export const postTransaction = async (transaction: TransactionCreateCommand): Promise<Transaction> => {
    const response = await fetch(TRANSACTION_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
    });
    return response.json();
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
    const response = await fetch(TRANSACTION_API_URL);
    return response.json();
};

export const deleteTransaction = async (id: number): Promise<Response> => {
    return fetch(`${TRANSACTION_API_URL}/${id}`, {
        method: "DELETE"
    });
};

export const updateTransaction: (transaction: TransactionUpdateCommand) => Promise<Response> = async (transaction) => {
    return await fetch(TRANSACTION_API_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
    });
};