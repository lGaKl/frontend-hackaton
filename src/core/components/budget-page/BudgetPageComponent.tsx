import "./BudgetPageComponent.css";
import { useEffect, useState } from "react";
import { Category } from "../../../features/categories/types/category.ts";
import { fetchCategories } from "../../../features/categories/services/category-service.tsx";

export function BudgetPageComponent() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        loadCategories();
    }, []);

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
                    <h2 className="budget-title">Budget Restant</h2>
                    <p className="budget-text">... €</p>
                </div>
            </div>

            <h3 className="title-h3">Vos catégories</h3>
            <ul className="ul-category">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <li key={category.id} className="div-category">
                            <div key={category.id} className="li-category">
                                <span className="span-category-name">{category.name}</span>
                                <span className="span-category-budgetmax">
                                Maximum: {category.maxBudget} €
                            </span>
                                <span className="span-category-budget">
                                Restant: ... €
                            </span>
                            </div>
                        </li>

                    ))
                ) : (
                    <p className="p-no-found">No categories found :(</p>
                )}
            </ul>
        </>
    );
}
