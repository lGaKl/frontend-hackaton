import { Category } from "../types/category.ts";
import { useCategories, useCategoryDispatch } from "../context/CategoriesContext.tsx";
import { ChangeEvent, useState, useEffect } from "react";
import "./CategoryComponent.css";
import { useNavigate } from "react-router";

interface CategoryListComponentProps {
    onCategoryDeleted: (categoryDeleted: Category) => void;
    onCategoryUpdated: (categoryUpdated: Category) => void;
}

export function CategoryListComponent({
    onCategoryUpdated,
}: CategoryListComponentProps) {
    const navigate = useNavigate();
    const dispatch = useCategoryDispatch();
    const categories = useCategories();
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [localEdits, setLocalEdits] = useState<Record<number, Category>>({});

    useEffect(() => {
        const userId = Number(localStorage.getItem("userId"));
        const userCategories = categories.filter(category => category.userId === userId);
        setFilteredCategories(userCategories);
    }, [categories]);

    const handleEditClick = (category: Category) => {
        setEditingCategoryId(category.id!);
        setLocalEdits((prev) => ({
            ...prev,
            [category.id!]: { ...category },
        }));
    };

    const handleSaveClick = (categoryId: number) => {
        const updatedCategory = localEdits[categoryId];
        if (!updatedCategory) return;

        onCategoryUpdated(updatedCategory);
        dispatch({ type: "update", category: updatedCategory });
        setEditingCategoryId(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, categoryId: number) => {
        const { name, value } = e.target;
        setLocalEdits((prev) => ({
            ...prev,
            [categoryId]: {
                ...prev[categoryId],
                [name]: name === "maxBudget" ? parseFloat(value) || 0 : value,
            },
        }));
    };

    return (
        <ul className="ul-category">
            <li
                className="li-category add-category"
                onClick={() => navigate("/categories/add")}
            >
                <span className="plus-icon">+</span>
            </li>
            {filteredCategories.map((category) => (
                <li key={category.id} className="li-category">
                    <div className="div-category">
                        {editingCategoryId === category.id ? (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    value={localEdits[category.id]?.name || ""}
                                    className="input-category"
                                    maxLength={12}
                                    onChange={(e) => handleChange(e, category.id!)}
                                />
                                <input
                                    type="number"
                                    name="maxBudget"
                                    value={localEdits[category.id]?.maxBudget || 0}
                                    className="input-category"
                                    onChange={(e) => handleChange(e, category.id!)}
                                />
                                <button
                                    className="button-category"
                                    onClick={() => handleSaveClick(category.id!)}
                                >
                                    Confirmer
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="span-category-name">
                                    {category.name}
                                </span>
                                <span className="span-category">
                                    Budget: {category.maxBudget} €
                                </span>
                                <button
                                    className="button-category"
                                    onClick={() => handleEditClick(category)}
                                >
                                    Modifier
                                </button>
                            </>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}