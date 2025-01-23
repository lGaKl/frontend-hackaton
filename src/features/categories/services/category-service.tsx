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
    const data = await response.json();
    return data.map((category: { name: any; }) => ({
        ...category,
        nameCategory: category.name
    }));
};


export const deleteCategory: (categoryId: number) => Promise<Response> = async (id: number) => {
    return await fetch(`${CATEGORY_API_URL}/${id}`, {
        method: "DELETE",
    });
}

export const updateCategory: (category: CategoryUpdateCommand) => Promise<Response> = async (category) => {
    const userId = parseInt(localStorage.getItem("userId") || "0", 10);
    const updatedCategory = { ...category, userId };

    return await fetch(CATEGORY_API_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
    });
};