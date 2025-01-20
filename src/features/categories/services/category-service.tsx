import {CategoryCreateCommand} from "./commands/category-create-command.ts";
import {Category} from "../types/category.ts";
import {CategoryUpdateCommand} from "./commands/category-update-command.ts";

const CATEGORY_API_URL = import.meta.env.VITE_API_URL + "/categories";

export const postCategory: (category: CategoryCreateCommand) => Promise<Category> = async (category: CategoryCreateCommand) => {
    const response = await fetch(CATEGORY_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    });
    return await response.json();
}

export const fetchCategories: () => Promise<Category[]> = async () => {
    const response = await fetch(CATEGORY_API_URL);
    return await response.json();
}

export const deleteCategory: (categoryId: number) => Promise<Response> = async (id: number) => {
    return await fetch(`${CATEGORY_API_URL}/${id}`, {
        method: "DELETE",
    });
}

export const updateCategory: (id: number, category: CategoryUpdateCommand) => Promise<Response> = async (id:number, category: CategoryUpdateCommand) => {
    return await fetch(`${CATEGORY_API_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    });
}