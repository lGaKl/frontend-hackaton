import "./BudgetPageComponent.css";
import { useEffect, useState } from "react";
import { Category } from "../../../features/categories/types/category.ts";
import { fetchCategories } from "../../../features/categories/services/category-service.tsx";
import { Budget } from "../../../features/budget/types/Budget.ts";
import { fetchBudgets } from "../../../features/budget/services/BudgetService.tsx";

export function BudgetPageComponent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [budget, setBudget] = useState<Budget | null>(null); // Stocke le budget principal (ou global).

    useEffect(() => {
        loadBudget();
        loadCategories();
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

    return (
        <>
            <h1 className="title-h1">Budget</h1>

            <div className="budget-container g-3 mb-5">
                <div className="budget-item">
                    <h2 className="budget-title">Total Budget</h2>
                    <p className="budget-text">
                        {budget ? `${budget.total} €` : "Loading..."}
                    </p>
                </div>
                <div className="budget-item">
                    <h2 className="budget-title">Remaining Budget</h2>
                    <p className="budget-text">... €</p>
                </div>
            </div>


            <div className="categories-container g-3">
                <h3 className="title-h3">Vos catégories</h3>
                <ul className="ul-category">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <li key={category.id} className="li-category">
                                <span className="span-category-name">{category.name}</span>
                                <span className="span-category-budgetmax">
                        Budget max: {category.maxBudget} €
                    </span>
                                <span className="span-category-budget">
                        Remaining budget: ... €
                    </span>
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
