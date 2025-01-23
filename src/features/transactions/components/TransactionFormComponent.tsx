import {FormEvent, useEffect, useState} from "react";
import {Category} from "../../categories/types/category.ts";
import {fetchCategories} from "../../categories/services/category-service.tsx";
import "./TransactionComponent.css"
import {TransactionCreateCommand} from "../services/commands/transaction-create-command.ts";
import {fetchBudgets} from "../../budget/services/BudgetService.tsx";
import {toast} from "react-toastify";

interface TransactionFormComponentProps {
    onTransactionCreated: (t: TransactionCreateCommand) => void;

}

export default function TransactionFormComponent({onTransactionCreated}: TransactionFormComponentProps) {
    const [formValid, setFormValid] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [inputsDescription, setInputsDescription] = useState({ description: "" });
    const [inputsAmount, setInputsAmount] = useState({ amount: 0 });
    const [categories, setCategories] = useState<Category[]>([]);

    function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputsDescription({ description: e.target.value });
    }

    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(",", ".");
        setInputsAmount({ amount: parseFloat(value) });
    }

    useEffect(() => {
        checkFormValidity();
        loadCategories();
    }, [inputsDescription, inputsAmount, selectedCategory]);

    function checkFormValidity() {
        const isDescriptionValid = !!inputsDescription.description;
        const isAmountValid = !!inputsAmount.amount && inputsAmount.amount > 0;
        const isCategoryValid = !!selectedCategory;
        setFormValid(isDescriptionValid && isAmountValid && isCategoryValid);
    }

    async function loadCategories(): Promise<void> {
        const userId = Number(localStorage.getItem("userId"));
        const categoriesFromAPI = await fetchCategories();
        const filteredCategories = categoriesFromAPI.filter(category => category.userId === userId);
        setCategories(filteredCategories);
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!formValid) return;
        try {
            const budgetId = await getCurrentUserBudgetId();
            const transaction = {
                amount: inputsAmount.amount,
                date_transaction: new Date().toISOString().split('T')[0],
                description: inputsDescription.description,
                budgetId: budgetId,
                categoryId: parseInt(selectedCategory)
            };
            console.log("current budget id", budgetId);
            console.log(transaction);
            onTransactionCreated(transaction);
            const form = e.target as HTMLFormElement;
            form.reset();
            setFormValid(false);
        } catch (error) {
            console.error('Error getting budget ID:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="form-transaction">
            <div className="div-transaction">
                <h1 className="h2-transaction">Nouvelle transaction</h1>
                <label className="label-transaction">Description</label>
                <input
                    type="text"
                    name="Description"
                    className="input-transaction"
                    onChange={handleDescriptionChange}
                /><br/>
                <label className="label-transaction">Amount</label>
                <input
                    type="number"
                    name="Amount"
                    className="input-transaction"
                    step="any"
                    onChange={handleAmountChange}
                /><br/>
                <label htmlFor="options" className="label-transaction">Select a category :</label>
                <select
                    id="options"
                    className="option-transaction"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">--Categories--</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select><br/>
                <input
                    type="submit"
                    className="submit-transaction"
                    disabled={!formValid}
                />
            </div>
        </form>
    );


}

export async function getCurrentUserBudgetId(): Promise<number> {
    const userId = Number(localStorage.getItem("userId"));
    const budgets = await fetchBudgets();
    const userBudget = budgets.find(budget => budget.userId === userId);
    return userBudget ? userBudget.id : 0;
}