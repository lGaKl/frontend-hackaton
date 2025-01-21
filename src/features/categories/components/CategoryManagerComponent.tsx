import {useCategoryDispatch} from "../context/CategoriesContext.tsx";
import {Category} from "../types/category.ts";
import {deleteCategory, fetchCategories, postCategory, updateCategory} from "../services/category-service.tsx";
import {ApiError} from "../../../shared/exceptions/ApiError.ts";
import {CategoryFormComponent} from "./CategoryFormComponent.tsx";
import {CategoryListComponent} from "./CategoryListComponent.tsx";
import {debounce} from "../../../shared/utils/Utils.ts";
import "./CategoryComponent.css";

export default function CategoryManagerComponent() {
    const dispatch = useCategoryDispatch();

    const onCategoryCreated: (category: Category) => void = async (category) => {
        const existingCategories = await fetchCategories();
        const categoryExists = existingCategories.some(c => c.nameCategory === category.nameCategory);

        if (categoryExists) {
            alert("Category with this name already exists!");
            return;
        }

        const sendCategory = async (category: Category) => {
            const categoryCreated = await postCategory({
                name: category.nameCategory, // Mapper nameCategory vers name
                maxBudget: category.maxBudget,
            });
            dispatch({ type: "add", category: { ...category, id: categoryCreated.id } });
        };
        sendCategory(category);
    };

    const onCategoryDeleted: (categoryDeleted: Category) => void = categoryDeleted => {
        if(!categoryDeleted.id)
            return;
        const sendDeleteCategory = async(category: Category) => {
            const response = await deleteCategory(category.id!!);
            if(response.ok)
                dispatch({type: "delete", category: category});
            else
                throw ApiError.fromResponseJson(await response.json());
        }
        sendDeleteCategory(categoryDeleted);
    }

    const onCategoryUpdated: (categoryUpdated: Category) => void = debounce((categoryUpdated: Category) => {
        const sendUpdateCategory = async (category: Category) => {
            const response = await updateCategory({
                // @ts-ignore
                id: category.id,
                name: category.nameCategory,
                maxBudget: category.maxBudget,
            });
            if (!response.ok) {
                throw new ApiError(await response.json());
            }
        };
        sendUpdateCategory(categoryUpdated);
    }, 500);

    return <>
        <h1>Category Manager Component</h1>
        <CategoryFormComponent onCategoryCreated={onCategoryCreated}/>
        <h3>Vos catégories</h3>
        <CategoryListComponent onCategoryDeleted={onCategoryDeleted} onCategoryUpdated={debounce(onCategoryUpdated, 500)}/>
    </>
}