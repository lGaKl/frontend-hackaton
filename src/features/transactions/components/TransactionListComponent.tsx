import {Transaction} from "../types/transaction.ts";
import {useTransactionDispatch, useTransactions} from "../contexts/TransactionContext.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {updateTransaction} from "../services/transaction-service.tsx";
import "./TransactionComponent.css"
import {fetchCategories} from "../../categories/services/category-service.tsx";
import {Category} from "../../categories/types/category.ts";

interface TransactionListComponentProps {
    onTransactionUpdated: (transaction: Transaction) => void;
}

export default function TransactionListComponent({onTransactionUpdated}: TransactionListComponentProps) {
    const dispatch = useTransactionDispatch();
    const transactions = useTransactions();
    const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);
    const [localEdits, setLocalEdits] = useState<Record<number, Transaction>>({});
    //categories
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleEditClick = (transaction: Transaction) => {
        setEditingTransactionId(transaction.id!);
        setSelectedCategory(String(transaction.categoryId));
        setLocalEdits((prev) => ({
            ...prev,
            [transaction.id!]: {
                ...transaction
            },

        }));
    };

    useEffect(() => {
        loadCategories();
    }, [selectedCategory]);

    async function loadCategories(): Promise<void> {
        const categoriesFromAPI = await fetchCategories();
        setCategories(categoriesFromAPI);
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const getCategoryName = (id: number): string => {
        const category = categories.find(category => category.id === id);
        return category ? category.name : "Catégorie pas trouvé";
    };


    const handleSaveClick = async (transactionId: number) => {
        const updatedTransaction = {...localEdits[transactionId]};
        if (!updatedTransaction) return;
        try {

            updatedTransaction.categoryId = parseInt(selectedCategory);

            const selectedCategoryId = parseInt(selectedCategory);
            const response = await updateTransaction({
                id: updatedTransaction.id,
                description: updatedTransaction.description,
                amount: updatedTransaction.amount,
                date_transaction: updatedTransaction.date_transaction,
                budgetId: updatedTransaction.budgetId,
                categoryId: selectedCategoryId
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de la transaction");
            }

            dispatch({type: "update", transaction: updatedTransaction});
            onTransactionUpdated(updatedTransaction); // Assurez-vous que cette ligne est correcte

            // Réinitialisez l'état d'édition
            setEditingTransactionId(null);
            setLocalEdits((prev) => {
                const newEdits = {...prev};
                delete newEdits[transactionId];
                return newEdits;
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, transactionId: number) => {
        const {name, value} = e.target;

        setLocalEdits((prev) => ({
            ...prev,
            [transactionId]: {
                ...prev[transactionId],
                //categoryId : newCategoryId,
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
                        <span className="span-transactions">Transaction #{index + 1}</span>
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
                                        name="date_transaction"
                                        onChange={(e) => handleChange(e, transaction.id!)}
                                        className="input-transaction"
                                    />
                                    <select id="options" name="categoryName" className="option-transaction"
                                            value={selectedCategory} onChange={handleCategoryChange}>
                                        <option
                                            value={localEdits[transaction.id]?.categoryId || " "}>{getCategoryName(transaction.categoryId)}</option>
                                        {categories
                                            .filter(category => category.id !== transaction.categoryId)
                                            .map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                    </select>
                                    <button onClick={() => handleSaveClick(transaction.id!)}
                                            className="button-transaction">Confirmer
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="span-transactions">Description: {transaction.description}</span>
                                    <span className="span-transactions">Montant: {transaction.amount} €</span>
                                    <span className="span-transactions">Date: {transaction.date_transaction}</span>
                                    <span className="span-transactions">Catégorie: {getCategoryName(transaction.categoryId)}</span>
                                    <button onClick={() => handleEditClick(transaction)}
                                            className="button-transaction">Modifier
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