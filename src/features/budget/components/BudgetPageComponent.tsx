import "./BudgetPageComponent.css";
import { useEffect, useState, useMemo } from "react";
import { Category } from "../../categories/types/category.ts";
import { fetchCategories } from "../../categories/services/category-service.tsx";
import { Budget } from "../types/Budget.ts";
import { fetchBudgets } from "../services/BudgetService.tsx";
import { Transaction } from "../../transactions/types/transaction.ts";
import { fetchTransactions } from "../../transactions/services/transaction-service.tsx";
import { useNavigate } from "react-router";

export default function BudgetPageComponent() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [budget, setBudget] = useState<Budget | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        loadBudget();
        loadCategories();
        loadTransactions();
    }, []);

    async function loadBudget(): Promise<void> {
        try {
            const budgetFromAPI = await fetchBudgets();
            if (budgetFromAPI.length > 0) {
                setBudget(budgetFromAPI[0]);
            }
        } catch (error) {
            console.error("Error fetching budget:", error);
        }
    }

    async function loadCategories(): Promise<void> {
        try {
            const categoriesFromAPI = await fetchCategories();
            setCategories(categoriesFromAPI);
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

    const calculateRemainingBudget = () => {
        if (!budget) return 0;
        const totalSpent = transactions.reduce((amount, transaction) => amount + parseFloat(transaction.amount.toString()), 0);
        const remaining = budget.total - totalSpent;
        return parseFloat(remaining.toFixed(2));
    };

    const remainingBudget = useMemo(calculateRemainingBudget, [budget, transactions]);

    const calculateRemainingBudgetByCategory = (categoryId: number | undefined) => {
        if (!categoryId) return 0;
        const categoryTransactions = transactions.filter((transaction) => transaction.categoryId === categoryId);
        const totalSpent = categoryTransactions.reduce((amount, transaction) => amount + parseFloat(transaction.amount.toString()), 0);
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
                    <div className="li-category-budget">
                        <h2 className="title-name">Budget restant</h2>
                        <p className="p-budget">{budget ? `${remainingBudget} €` : "Loading..."}</p>
                    </div>
                    <br />
                    <div className="li-category-budget">
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
            </div>
            <div>
                <h3 className="title-h3">Vos catégories</h3>
                <ul className="ul-category">
                    {categoriesWithRemainingBudget.length > 0 ? (
                        categoriesWithRemainingBudget.map((category) => (
                            <li key={category.id} className="li-category-budget">
                                <span className="span-category-name">{category.name}</span>
                                <span className="span-category-budgetmax">Budget restant : {category.remainingBudget} €</span>
                                <span className="span-category-budget">Budget initial : {category.maxBudget} €</span>
                            </li>
                        ))
                    ) : (
                        <p className="p-no-found">No categories found :(</p>
                    )}
                </ul>
            </div>
        </>
    );
}