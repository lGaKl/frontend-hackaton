import {Transaction} from "../types/transaction";
import {ChangeEvent, useState, useEffect} from "react";
import "./TransactionComponent.css";
import {useNavigate} from "react-router";
import {useTransactionDispatch, useTransactions} from "../contexts/TransactionContext.tsx";
import {fetchBudgetById} from "../../budget/services/BudgetService.tsx";

interface TransactionListComponentProps {
    onTransactionUpdated: (transactionUpdated: Transaction) => void;
}

export default function TransactionListComponent({
    onTransactionUpdated,
}: TransactionListComponentProps) {
    const navigate = useNavigate();
    const dispatch = useTransactionDispatch();
    const transactions = useTransactions();
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);
    const [localEdits, setLocalEdits] = useState<Record<number, Transaction>>({});

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

    const handleEditClick = (transaction: Transaction) => {
        setEditingTransactionId(transaction.id!);
        setLocalEdits((prev) => ({
            ...prev,
            [transaction.id!]: {...transaction},
        }));
    };

    const handleSaveClick = (transactionId: number) => {
        const updatedTransaction = localEdits[transactionId];
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

    return <>
        <h1 className="h1-transactions">Liste des transactions</h1>
        <ul className="ul-transaction">
            <li
                className="li-transaction add-transaction"
                onClick={() => navigate("/transactions/add")}
            >
                <span className="plus-icon">+</span>
            </li>
            {filteredTransactions.map((transaction) => (
                <li key={transaction.id} className="li-transaction">
                    <div className="div-transaction">
                        {editingTransactionId === transaction.id ? (
                            <>
                                <input
                                    type="text"
                                    name="description"
                                    value={localEdits[transaction.id]?.description || ""}
                                    className="input-transaction"
                                    onChange={(e) => handleChange(e, transaction.id!)}
                                />
                                <input
                                    type="number"
                                    name="amount"
                                    value={localEdits[transaction.id]?.amount || 0}
                                    className="input-transaction"
                                    onChange={(e) => handleChange(e, transaction.id!)}
                                />
                                <button
                                    className="button-transaction"
                                    onClick={() => handleSaveClick(transaction.id!)}
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="span-transaction-description">
                                    {transaction.description}
                                </span>
                                <span className="span-transaction">
                                    Amount: {transaction.amount} €
                                </span>
                                <button
                                    className="button-transaction"
                                    onClick={() => handleEditClick(transaction)}
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    </>;
}