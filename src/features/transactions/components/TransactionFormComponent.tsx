import {FormEvent, useEffect, useState} from "react";
import {Category} from "../../categories/types/category.ts";
import {fetchCategories} from "../../categories/services/category-service.tsx";
import "./TransactionComponent.css"
import {TransactionCreateCommand} from "../services/commands/transaction-create-command.ts";
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
    },[inputsDescription, inputsAmount,selectedCategory]);

    function checkFormValidity() {
        const isDescriptionValid = !!inputsDescription.description;
        const isAmountValid = !!inputsAmount.amount && inputsAmount.amount > 0;
        const isCategoryValid = !!selectedCategory;
        setFormValid(isDescriptionValid && isAmountValid && isCategoryValid);
    }

    async function loadCategories() : Promise<void> {
        const categoriesFromAPI = await fetchCategories();
        setCategories(categoriesFromAPI);
    }
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    function handleSubmit(e : FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(!formValid) return;
        const transaction = {
            amount: inputsAmount.amount,
            date_transaction: new Date().toISOString().split('T')[0],
            description: inputsDescription.description,
            //Ajouter idCategory et idBudget
            budgetId: 1,
            categoryId: parseInt(selectedCategory),

        };
        console.log(transaction);
        onTransactionCreated(transaction);
        toast.success("Transaction créée avec succès !");
        const form = e.target as HTMLFormElement;
        form.reset();
        setFormValid(false);
    }

    return (
        <form onSubmit={handleSubmit} className="form-transaction">
            <div className="div-transaction">
                <h1 className="h2-transaction">Nouvelle transaction</h1>
                <label className="label-transaction">Description :</label>
                <input
                    type="text"
                    name="Description"
                    className="input-transaction"
                    onChange={handleDescriptionChange}
                /><br/>
                <label className="label-transaction">Montant :</label>
                <input
                    type="number"
                    name="Amount"
                    min="1"
                    className="input-transaction"
                    step="any"
                    onChange={handleAmountChange}
                /><br/>
                <label htmlFor="options" className="label-transaction">Séléction de la catégorie  :</label>
                <select
                    id="options"
                    className="option-transaction"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">--Catégories--</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select><br/>
                <label></label>
                <input
                    type="submit"
                    className="submit-transaction"
                    disabled={!formValid}
                />
            </div>
        </form>
    );


}

