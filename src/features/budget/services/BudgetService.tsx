import {BudgetCreateCommand} from "./commands/BudgetCreateCommand.ts";
import {Budget} from "../types/Budget.ts";
import {BudgetUpdateCommand} from "./commands/BudgetUpdateCommand.ts";

const BUDGET_API_URL = import.meta.env.VITE_API_URL + "/budgets";

export const postBudget: (budget: BudgetCreateCommand) => Promise<Budget> = async (budget: BudgetCreateCommand) => {
    console.log("Budget API URL:", BUDGET_API_URL);
    const response = await fetch(BUDGET_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(budget)
    });
    return await response.json();
}

export const fetchBudgets = async (): Promise<Budget[]> => {
    const response = await fetch(BUDGET_API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch budgets');
    }
    return response.json();
};

export const deleteBudget = async (id: number): Promise<Response> => {
    return fetch(`${BUDGET_API_URL}/${id}`, {
        method: "DELETE"
    });
};

export const fetchBudgetById : (id: number) => Promise<Budget> = async (id: number) =>{
    const response = await fetch (`${BUDGET_API_URL}/${id}`);
    return await response.json();
}

export const UpdateBudgets : (id: number, budget: BudgetUpdateCommand) => Promise<Response> = async(id:number, budget: BudgetUpdateCommand )=>{
    return await fetch (`${BUDGET_API_URL}/${id}`,{
        method: "PATCH",
        headers:{
            "content-Type" : "application/json"
        },
        body: JSON.stringify(budget)
    });
};