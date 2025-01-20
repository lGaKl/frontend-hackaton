import {Category} from "../types/category.ts";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import "./CategoryComponent.css";

interface CategoryFormComponentProps {
    onCategoryCreated: (c: Category) => void
}

export function CategoryFormComponent({onCategoryCreated}: CategoryFormComponentProps) {
    const [inputs, setInputs] = useState({nameCategory: "", maxBudget:""});
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        checkFormValidity();
    }, [inputs]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    function checkFormValidity(){
        setFormValid(!!inputs.nameCategory);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!formValid) return;
        let category = {nameCategory: inputs.nameCategory, maxBudget: Number(inputs.maxBudget)};
        onCategoryCreated(category);
        const form = e.target as HTMLFormElement;
        form.reset();
        setFormValid(false);
    }

    return <form onSubmit={handleSubmit}>
        <div>
            <h2>Ajouter une catégorie</h2>
            <label>
                Nom de la Catégorie <input type="text" name="nameCategory" onChange={handleChange}/>
            </label>
            <br/>
            <label>
                Budget Maximum  <input type="number" name="maxBudget" onChange={handleChange}/>
            </label>
        </div>
        <input type="submit" disabled={!formValid}/>
    </form>
}