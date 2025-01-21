import {Category} from "../types/category.ts";
import {useCategories, useCategoryDispatch} from "../context/CategoriesContext.tsx";
import {ChangeEvent} from "react";
import "./CategoryComponent.css";

interface CategoryListComponentProps {
    onCategoryDeleted: (categoryDeleted: Category) => void,
    onCategoryUpdated: (categoryUpdated: Category) => void
}

export function CategoryListComponent({ onCategoryDeleted, onCategoryUpdated }: CategoryListComponentProps) {
    const dispatch = useCategoryDispatch();
    const categories = useCategories();

    function processCategoryDeletion(category: Category) {
        if (!confirm("Etes-vous sûr de vouloir supprimer?")) return;
        onCategoryDeleted(category);
    }

    function processCategoryUpdating(e: ChangeEvent<HTMLInputElement>, category: Category) {
        const updatedCategory = {...category};
        const value = e.target.value;

        switch (e.target.name) {
            case "nameCategory":
                updatedCategory.nameCategory = value;
                break;
            case "maxBudget":
                updatedCategory.maxBudget = Number(value);
                break;
        }
        dispatch({type: "update", category: updatedCategory});
        onCategoryUpdated(updatedCategory);
    }

    const categoryLiElements = categories.map(category => (
        <li key={category.id} className="li-category">
            <span className="span-category">Numéro: {category.id}</span>
            <div className="div-category">
                <input
                    type="text"
                    value={category.nameCategory}
                    className="input-category"
                    onChange={e => processCategoryUpdating(e, category)}
                />
                <input
                    type="text"
                    value={category.maxBudget}
                    className="input-category"
                    onChange={e => processCategoryUpdating(e, category)}
                />
                <button onClick={() => processCategoryDeletion(category)} className="button-category">Supprimer</button>
            </div>
        </li>
    ));

    //console.log(categoryLiElements);
    return <ul className="ul-category">{categoryLiElements}</ul>;
}
