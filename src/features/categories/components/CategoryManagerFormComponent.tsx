import {useCategoryDispatch} from "../context/CategoriesContext.tsx";
import {Category} from "../types/category.ts";
import {fetchCategories, postCategory} from "../services/category-service.tsx";
import CategoryFormComponent from "./CategoryFormComponent.tsx";

export default function CategoryManagerFormComponent() {
    const dispatch = useCategoryDispatch();


    const onCategoryCreated: (category: Category) => void = async (category) => {
        const existingCategories = await fetchCategories();
        const categoryExists = existingCategories.some(c => c.name === category.name && c.userId === category.userId);
        if (categoryExists) {
            alert("Category with this name already exists!");
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User ID not found in local storage!");
            return;
        }

        const sendCategory = async (category: Category) => {
            const categoryCreated = await postCategory({
                name: category.name,
                maxBudget: category.maxBudget,
                userId: Number(userId)
            });
            dispatch({ type: "add", category: { ...category, id: categoryCreated.id } });
        };
        sendCategory(category);
    };
    return <>
        <h1 className="h1-category">Ajout catégorie</h1>
        <CategoryFormComponent onCategoryCreated={onCategoryCreated} />
    </>
}