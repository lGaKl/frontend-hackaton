import {Category} from "../types/category.ts";
import {useCategories, useCategoryDispatch} from "../context/CategoriesContext.tsx";
import {ChangeEvent} from "react";
import "./CategoryComponent.css";
import {useNavigate} from "react-router";

interface CategoryListComponentProps {
    onCategoryDeleted: (categoryDeleted: Category) => void,
    onCategoryUpdated: (categoryUpdated: Category) => void
}

export function CategoryListComponent({ onCategoryDeleted, onCategoryUpdated }: CategoryListComponentProps) {
    const navigate = useNavigate(); //hook pour la navigation askip
    const dispatch = useCategoryDispatch();
    const categories = useCategories();

    function processCategoryDeletion(category: Category) {
        if (!confirm("Etes-vous sûr de vouloir supprimer?")) return;
        onCategoryDeleted(category);
    }

    function processCategoryUpdating(e: ChangeEvent<HTMLInputElement>, category: Category) {
        const updatedCategory = { ...category };
        const value = e.target.value;

        switch (e.target.name) {
            case "name": // Correspond à la propriété utilisée dans l'API
                updatedCategory.name = value;
                break;
            case "maxBudget":
                updatedCategory.maxBudget = parseFloat(value) || 0; // Permet les valeurs décimales
                break;
        }
        dispatch({ type: "update", category: updatedCategory });
        onCategoryUpdated(updatedCategory);
    }

    const categoryLiElements = categories.map(category => (
        <li key={category.id} className="li-category">
            <span className="span-category">Numéro: {category.id}</span>
            <div className="div-category">
                <input
                    type="text"
                    value={category.name}
                    name="name"
                    className="input-category"
                    onChange={e => processCategoryUpdating(e, category)}
                />
                <input
                    type="number"
                    value={category.maxBudget}
                    name="maxBudget"
                    className="input-category"
                    onChange={e => processCategoryUpdating(e, category)}
                />
                <button onClick={() => processCategoryDeletion(category)} className="button-category">Supprimer</button>
            </div>
        </li>
    ));

    return (
        <ul className="ul-category">
            {categoryLiElements}
            {/* Ajouter une tuile "vide" pour naviguer vers le formulaire */}
            <li className="li-category add-category" onClick={() => navigate("/categories/add")}>
                <span className="plus-icon">+</span>
            </li>
        </ul>
    );
}