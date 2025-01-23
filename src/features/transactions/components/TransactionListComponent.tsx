import {Transaction} from "../types/transaction";
import React, {ChangeEvent, useState, useEffect} from "react";
import "./TransactionComponent.css";
import {useTransactionDispatch, useTransactions} from "../contexts/TransactionContext.tsx";
import {fetchBudgetById} from "../../budget/services/BudgetService.tsx";
import {Category} from "../../categories/types/category.ts";
import {fetchCategories} from "../../categories/services/category-service.tsx";

interface TransactionListComponentProps {
    onTransactionUpdated: (transactionUpdated: Transaction) => void;
    onTransactionDeleted: (transactionDeleted: Transaction) => void;
}

export default function TransactionListComponent({
    onTransactionUpdated,onTransactionDeleted
}: TransactionListComponentProps) {
    const dispatch = useTransactionDispatch();
    const transactions = useTransactions();
    const [, setFilteredTransactions] = useState<Transaction[]>([]);
    const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);
    const [localEdits, setLocalEdits] = useState<Record<number, Transaction>>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const userId = Number(localStorage.getItem("userId"));
        console.log("User ID:", userId);
        if (!userId) {
            console.error("User ID is not found in localStorage");
            return;
        }

        console.log("All Transactions:", transactions);

        const fetchUserTransactions = async () => {
            const userTransactions = await Promise.all(transactions.map(async (transaction) => {
                const budget = await fetchBudgetById(transaction.budgetId);
                console.log("Budget:", budget);
                const isUserTransaction = budget && budget.userId === userId;
                console.log("Transaction:", transaction, "Budget:", budget, "Is User Transaction:", isUserTransaction);
                return isUserTransaction ? transaction : null;
            }));

            const filtered = userTransactions.filter(Boolean) as Transaction[];
            console.log("Filtered Transactions:", filtered);
            setFilteredTransactions(filtered);
            console.log("Filtered Transactions State Updated:", filtered);


        };

        fetchUserTransactions();
    }, [transactions]);

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

    const handleEditClick = (transaction: Transaction) => {
        setEditingTransactionId(transaction.id!);
        setSelectedCategory(String(transaction.categoryId));
        setLocalEdits((prev) => ({
            ...prev,
            [transaction.id!]: {...transaction},
        }));
    };

    const handleSaveClick = (transactionId: number) => {
        const updatedTransaction = {
            ...localEdits[transactionId],
            categoryId: Number(selectedCategory),
        };
        if (!updatedTransaction) return;

        onTransactionUpdated(updatedTransaction);
        dispatch({type: "update", transaction: updatedTransaction});
        setEditingTransactionId(null);
    };



    const handleChange = (e: ChangeEvent<HTMLInputElement>, transactionId: number) => {
        const {name, value} = e.target;
        setLocalEdits((prev) => ({
            ...prev,
            [transactionId]: {
                ...prev[transactionId],
                [name]: name === "amount" ? parseFloat(value) || 0 : value,
            },
        }));
    };

    function processTransactionDelete (transaction: Transaction) {
        if (!confirm("Voulez vous supprimer la transaction?")) return;
        onTransactionDeleted(transaction);
    }

    return (
        <div>
            <h1 className="h1-transactions">Liste des transactions</h1>
            <ul className="ul-transactions">
                {transactions.map((transaction, index) => (
                    <li key={transaction.id} className="li-transactions">
                        <h1 className="span-transactions-header">Transaction #{index + 1}</h1>
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
                                        min="1"
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
                                    <div className="button-container">
                                        <button
                                            className="button-delete-transaction" onClick={()=> processTransactionDelete(transaction)}>Supprimer
                                        </button>
                                        <button onClick={() => handleSaveClick(transaction.id!)}
                                                className="button-transaction">Confirmer
                                        </button>

                                    </div>
                                </>
                            ) : (
                                <>
                                <span className="span-transactions">Description: <span className="span-transactions-data">{transaction.description}</span></span>
                                    <span className="span-transactions">Montant: <span className="span-transactions-data">{transaction.amount} €</span></span>
                                    <span className="span-transactions">Date: <span className="span-transactions-data">{transaction.date_transaction}</span></span>
                                    <span className="span-transactions">Catégorie: <span className="span-transactions-data">{getCategoryName(transaction.categoryId)}</span></span>
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