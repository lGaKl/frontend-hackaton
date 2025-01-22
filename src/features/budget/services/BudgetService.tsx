import {BudgetCreateCommand} from "./commands/BudgetCreateCommand.ts";
import {Budget} from "../types/Budget.ts";
import {BudgetUpdateCommand} from "./commands/BudgetUpdateCommand.ts";

const BUDGET_API_URL = import.meta.env.VITE_API_URL + "/budgets";

export const postBudget: (budget: BudgetCreateCommand) => Promise<Budget> = async (budget: BudgetCreateCommand)=>{
    const response = await fetch (BUDGET_API_URL,{
        method: "POST",
        headers:{
            "content-Type" : "application/json"
        },
        body: JSON.stringify(budget)
    });
    return await response.json();
}

export const fetchBudgets: () => Promise<Budget[]> = async () =>{
    const response = await fetch (BUDGET_API_URL);
    return await response.json();
}

export const deleteBudgets : (budgetId: number) => Promise<Response> = async (id : number)=>{
    return await fetch (`${BUDGET_API_URL}/${id}`,{
        method: "DELETE",
    });
}

export const updateBudgets : (id: number, budget: BudgetUpdateCommand) => Promise<Response> = async(id:number, budget: BudgetUpdateCommand )=>{
    return await fetch (`${BUDGET_API_URL}/${id}`,{
        method: "PATCH",
        headers:{
            "content-Type" : "application/json"
        },
        body:JSON.stringify(budget)
    });
}