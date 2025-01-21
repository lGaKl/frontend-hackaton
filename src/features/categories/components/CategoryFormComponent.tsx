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

    return <form onSubmit={handleSubmit} className="form-category">
        <div className="div-category">
            <h2 className="h2-category">Ajouter une catégorie</h2>
            <label className="label-category">
                Nom de la Catégorie <input type="text" name="nameCategory" className="input-category" onChange={handleChange}/>
            </label>
            <br/>
            <label className="label-category">
                Budget Maximum  <input type="number" name="maxBudget" className="input-category" onChange={handleChange}/>
            </label>
        </div>
        <input type="submit" className="submit-category" disabled={!formValid}/>
    </form>
}