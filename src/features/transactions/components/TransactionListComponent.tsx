import { Transaction } from "../types/transaction.ts";
import { useTransactionDispatch, useTransactions } from "../contexts/TransactionContext.tsx";
import { ChangeEvent, useState } from "react";
import { updateTransaction } from "../services/transaction-service.tsx";
import "./TransactionComponent.css"

interface TransactionListComponentProps {
    onTransactionUpdated: (transaction: Transaction) => void;
}

export default function TransactionListComponent({ onTransactionUpdated }: TransactionListComponentProps) {
    const dispatch = useTransactionDispatch();
    const transactions = useTransactions();
    const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);
    const [localEdits, setLocalEdits] = useState<Record<number, Transaction>>({});

    const handleEditClick = (transaction: Transaction) => {
        setEditingTransactionId(transaction.id!);
        setLocalEdits((prev) => ({
            ...prev,
            [transaction.id!]: { ...transaction }
        }));
    };

    const handleSaveClick = async (transactionId: number) => {
        const updatedTransaction = localEdits[transactionId];
        if (!updatedTransaction) return;

        try {
            const response = await updateTransaction({
                id: updatedTransaction.id,
                description: updatedTransaction.description,
                amount: updatedTransaction.amount,
                date_transaction: updatedTransaction.date_transaction,
                budgetId: updatedTransaction.budgetId,
                categoryId: updatedTransaction.categoryId,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de la transaction");
            }

            dispatch({ type: "update", transaction: updatedTransaction });
            onTransactionUpdated(updatedTransaction); // Assurez-vous que cette ligne est correcte

            // Réinitialisez l'état d'édition
            setEditingTransactionId(null);
            setLocalEdits((prev) => {
                const newEdits = { ...prev };
                delete newEdits[transactionId];
                return newEdits;
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, transactionId: number) => {
        const { name, value } = e.target;
        setLocalEdits((prev) => ({
            ...prev,
            [transactionId]: {
                ...prev[transactionId],
                [name]: name === "amount" ? Number(value) : value
            }
        }));
    };

    return (
        <div>
            <h1 className="h1-transactions">Liste des transactions</h1>
            <ul className="ul-transactions">
                {transactions.map((transaction, index) => (
                    <li key={transaction.id} className="li-transactions">
                        <h2 className="span-transactions-title">Transaction #{index + 1}</h2>
                        <div className="div-transactions">
                            {editingTransactionId === transaction.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={localEdits[transaction.id]?.description || ""}
                                        name="description"
                                        onChange={(e) => handleChange(e, transaction.id!)}
                                        className="input-transaction"
                                    />
                                    <input
                                        type="number"
                                        value={localEdits[transaction.id]?.amount || 0}
                                        name="amount"
                                        onChange={(e) => handleChange(e, transaction.id!)}
                                        className="input-transaction"
                                    />
                                    <input
                                        type="date"
                                        value={localEdits[transaction.id]?.date_transaction || ""}
                                        name="dateTransaction"
                                        onChange={(e) => handleChange(e, transaction.id!)}
                                        className="input-transaction"
                                    />
                                    <button
                                        onClick={() => handleSaveClick(transaction.id!)}
                                        className="button-transaction"
                                    >
                                        Confirmer
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="span-transactions">Description: <span className="span-transactions-data">{transaction.description}</span></span>
                                    <span className="span-transactions">Montant: <span className="span-transactions-data">{transaction.amount} €</span></span>
                                    <span className="span-transactions">Date: <span className="span-transactions-data">{transaction.date_transaction}</span></span>
                                    <span className="span-transactions">Catégorie: <span className="span-transactions-data">{transaction.categoryId}</span></span>
                                    <button
                                        onClick={() => handleEditClick(transaction)}
                                        className="button-transaction"
                                    >
                                        Modifier
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}