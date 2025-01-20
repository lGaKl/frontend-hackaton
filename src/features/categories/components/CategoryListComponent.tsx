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

    const placeholderCategories = [
        { id: 1, nameCategory: "Placeholder 1", maxBudget: 100 },
        { id: 2, nameCategory: "Placeholder 2", maxBudget: 200 },
    ];

    function processCategoryDeletion(category: Category) {
        if(!confirm("Etes-vous sûr de vouloir supprimer?")) return;
        onCategoryDeleted(category);
    }

    function processCategoryUpdating(e: ChangeEvent<HTMLInputElement>, category: Category) {
        const valuename = e.target.value;
        const valuebudget = e.target.value;

        switch (e.target.name){
            case "name":
                category.nameCategory = valuename;
                break;
            case "Budget":
                category.maxBudget = Number(valuebudget);
                break;
        }
        dispatch({type: "update", category: category});
        onCategoryUpdated(category);
    }

    const categoryLiElements = (categories.length ? categories : placeholderCategories).map(category => (
        <li key={category.id}>
            <span>Numéro: {category.id}</span>
            <div>
                <input type="text" value={category.nameCategory} name={'nameCategory'}
                       onChange={e => processCategoryUpdating(e, category)}/>
                <input type="text" value={category.maxBudget} name={'maxBudget'}
                       onChange={e => processCategoryUpdating(e, category)}/>
                <button onClick={() => processCategoryDeletion(category)}>Supprimer</button>
            </div>
        </li>
    ));

    return <ul>{categoryLiElements}</ul>;
}