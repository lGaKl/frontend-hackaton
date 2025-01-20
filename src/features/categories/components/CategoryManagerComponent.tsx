import {useCategoryDispatch} from "../context/CategoriesContext.tsx";
import {Category} from "../types/category.ts";
import {deleteCategory, postCategory, updateCategory} from "../services/category-service.tsx";
import {ApiError} from "../../../shared/exceptions/ApiError.ts";
import {CategoryFormComponent} from "./CategoryFormComponent.tsx";
import {CategoryListComponent} from "./CategoryListComponent.tsx";
import {debounce} from "../../../shared/utils/Utils.ts";
import "./CategoryComponent.css";

export default function CategoryManagerComponent() {
    const dispatch = useCategoryDispatch();

    const onCategoryCreated: (category: Category) => void = category => {
        const sendCategory = async(category: Category) => {
            const categoryCreated = await postCategory({nameCategory: category.nameCategory});
            dispatch({type: "add", category: categoryCreated});
        }
        sendCategory(category);
    }

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

    const onCategoryUpdated: (categoryUpdated: Category) => void = categoryUpdated => {
        const sendUpdateCategory = async (category: Category) => {
            const response = await updateCategory(category.id!!, {
                nameCategory: category.nameCategory,
                maxBudget: category.maxBudget,
            });
            if(!response.ok)
                throw new ApiError(await response.json());
        }
        sendUpdateCategory(categoryUpdated);
    }

    return <>
        <h1>Category Manager Component</h1>
        <CategoryFormComponent onCategoryCreated={onCategoryCreated}/>
        <h3>Vos catégories</h3>
        <CategoryListComponent onCategoryDeleted={onCategoryDeleted} onCategoryUpdated={debounce(onCategoryUpdated, 500)}/>
    </>
}