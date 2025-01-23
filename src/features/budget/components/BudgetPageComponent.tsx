import "./BudgetPageComponent.css";
import React, { useEffect, useState, useMemo } from "react";
import { Category } from "../../categories/types/category.ts";
import { fetchCategories } from "../../categories/services/category-service.tsx";
import { Budget } from "../types/Budget.ts";
import { fetchBudgets } from "../services/BudgetService.tsx";
import { Transaction } from "../../transactions/types/transaction.ts";
import { fetchTransactions } from "../../transactions/services/transaction-service.tsx";
import {useNavigate} from "react-router";

export default function BudgetPageComponent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [budget, setBudget] = useState<Budget | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newBudget, setNewBudget] = useState({ total: '', date: '' });
    const navigate = useNavigate();


    const userId = parseInt(localStorage.getItem('userId') || '0', 10);

    useEffect(() => {
        loadBudget();
        loadCategories();
        loadTransactions();
    }, []);

    /* load data (budget, categories and transactions) */
    async function loadBudget(): Promise<void> {
        try {
            const budgetFromAPI = await fetchBudgets();
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const filteredBudget = budgetFromAPI.find(budget => {
                const budgetDate = new Date(budget.date);
                return !isNaN(budgetDate.getTime()) &&
                    budgetDate.getFullYear() === currentYear &&
                    budgetDate.getMonth() + 1 === currentMonth &&
                    budget.userId === userId;
            });

            if (filteredBudget) {
                setBudget(filteredBudget);
            }
        } catch (error) {
            console.error("Error fetching budget:", error);
        }
    }

    async function loadCategories(): Promise<void> {
        try {
            const categoriesFromAPI = await fetchCategories();
            const filteredCategories = categoriesFromAPI.filter(category => category.userId === userId);
            setCategories(filteredCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    async function loadTransactions(): Promise<void> {
        try {
            const transactionsFromAPI = await fetchTransactions();
            setTransactions(transactionsFromAPI);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }

    /* ---------------------------------------------------------------------------------------------------- */

    const calculateRemainingBudget = () => {
        if (!budget) {
            return 0;
        }

        const budgetDate = new Date(budget.date);
        const budgetMonth = budgetDate.getMonth();
        const budgetYear = budgetDate.getFullYear();

        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date_transaction);
            return transaction.budgetId === budget.id &&
                transactionDate.getMonth() === budgetMonth &&
                transactionDate.getFullYear() === budgetYear;
        });

        const totalSpent = filteredTransactions.reduce(
            (amount, transaction) => amount + parseFloat(transaction.amount.toString()), 0);

        const remaining = budget.total - totalSpent;
        return parseFloat(remaining.toFixed(2));
    };

    const remainingBudget = useMemo(calculateRemainingBudget, [budget, transactions]);

    const calculateRemainingBudgetByCategory = (categoryId: number | undefined) => {
        if (!categoryId) return 0;

        const categoryTransactions = transactions.filter((transaction) => transaction.categoryId === categoryId);

        const totalSpent = categoryTransactions.reduce(
            (amount, transaction) => amount + parseFloat(transaction.amount.toString()), 0);

        const category = categories.find((cat) => cat.id === categoryId);
        if (!category) return 0;

        return category.maxBudget - totalSpent;
    };

    const categoriesWithRemainingBudget = useMemo(() => {
        return categories.map((category) => ({
            ...category,
            remainingBudget: calculateRemainingBudgetByCategory(category.id),
        }));
    }, [categories, transactions]);

    const handleShowForm = () => {
        navigate("/budget/newBudget");
    };

    return (
        <>
            <h1 className="title-h1">Budget</h1>

            <div className="grid-item">
                <div className="div-category">
                    <div className="li-category">
                        <h2 className="title-name">Budget Total</h2>
                        <p className="p-budget">{budget ? `${budget.total} €` : "- €"}</p>
                        {!budget && (
                            <button
                                className="button-add"
                                style={{
                                    backgroundColor: "#91a767",
                                    border: "1px solid #91a767",
                                    padding: "0.5rem 1rem",
                                    cursor: "pointer",
                                }}
                                onClick={handleShowForm}
                            >
                                Add Budget
                            </button>
                        )}
                    </div>
                </div>
                <br/>
                <div className="div-category">
                    <div className="li-category">
                        <h2 className="title-name">Budget restant</h2>
                        <p className="p-budget">{budget ? `${remainingBudget} €` : "Loading..."}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="title-h3">Vos catégories</h3>
                <ul className="ul-category">
                    {categoriesWithRemainingBudget.length > 0 ? (
                        categoriesWithRemainingBudget.map((category) => (
                            <li key={category.id} className="li-category">
                                <span className="span-category-name">{category.name}</span>
                                <span className="span-category-budget">
                                Budget: {category.maxBudget} €
                            </span>
                                <span className="span-category-budgetmax">
                                Restant: {category.remainingBudget} €
                            </span>
                            </li>
                        ))
                    ) : (
                        <p className="p-no-found">No categories found :(</p>
                    )}
                </ul>
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add new budget</h2>
                            <button onClick={handleCloseForm} className="close-button">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="formBudgetTotal">Total Budget</label>
                                    <input
                                        id="formBudgetTotal"
                                        type="number"
                                        placeholder="Enter total budget"
                                        style={{ fontFamily: "Elephant, sans-serif" }}
                                        value={newBudget.total}
                                        onChange={(e) =>
                                            setNewBudget({ ...newBudget, total: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="formBudgetDate">Date</label>
                                    <input
                                        id="formBudgetDate"
                                        type="date"
                                        value={newBudget.date}
                                        style={{ fontFamily: "Elephant, sans-serif" }}
                                        onChange={(e) =>
                                            setNewBudget({ ...newBudget, date: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: "#91a767",
                                        border: "1px solid #91a767",
                                        padding: "0.5rem 1rem",
                                        marginTop: "1rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    Save new budget
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}