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
        setEditingTransactionId(transaction.id);
        setLocalEdits((prev) => ({
            ...prev,
            [transaction.id]: { ...transaction }

        }));
        console.log("transaction :",transaction);
    };

    const handleSaveClick = async (transactionId: number) => {
        const updatedTransaction = localEdits[transactionId];
        console.log("Mise à jour de la transaction :", updatedTransaction);
        if (!updatedTransaction) return;

        try {


            const response = await updateTransaction(transactionId, {
                amount: updatedTransaction.amount,
                date_transaction: updatedTransaction.date_transaction,
                description: updatedTransaction.description,
                budgetId: updatedTransaction.budgetId,
                categoryId: updatedTransaction.categoryId
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de la transaction");
            }

            dispatch({ type: "update", transaction: updatedTransaction });
            onTransactionUpdated(updatedTransaction);

            setEditingTransactionId(null);
            setLocalEdits((prev) => {
                const newEdits = { ...prev };
                delete newEdits[transactionId];
                return newEdits;
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            alert("Échec de la mise à jour de la transaction. Veuillez réessayer.");
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
            <h1 className="h1">Liste des transactions</h1>
            <ul className="ul">
                {transactions.map((transaction, index) => (
                    <li key={transaction.id} className="li">
                        <span className="span">Transaction #{index + 1}</span>
                        <div className="div">
                            {editingTransactionId === transaction.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={localEdits[transaction.id]?.description || ""}
                                        name="description"
                                        onChange={(e) => handleChange(e, transaction.id)}
                                        className="input-transaction"
                                    />
                                    <input
                                        type="number"
                                        value={localEdits[transaction.id]?.amount || 0}
                                        name="amount"
                                        onChange={(e) => handleChange(e, transaction.id)}
                                        className="input-transaction"
                                    />
                                    <input
                                        type="date"
                                        value={localEdits[transaction.id]?.date_transaction || ""}
                                        name="date_transaction"
                                        onChange={(e) => handleChange(e, transaction.id)}
                                        className="input-transaction"
                                    />
                                    <button onClick={() => handleSaveClick(transaction.id)} className="button-category">Confirmer</button>
                                </>
                            ) : (
                                <>
                                    <span className="span">Description: {transaction.description}</span>
                                    <span className="span">Montant: {transaction.amount}</span>
                                    <span className="span">Date: {transaction.date_transaction}</span>
                                    <button onClick={() => handleEditClick(transaction)} className="button-category">Modifier</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}