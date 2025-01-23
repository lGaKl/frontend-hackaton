import {Category} from "../types/category.ts";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import "./CategoryComponent.css";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";

interface CategoryFormComponentProps {
    onCategoryCreated?: (c: Category) => void
}

export default function CategoryFormComponent({onCategoryCreated}: CategoryFormComponentProps) {
    const navigate = useNavigate(); //hook de navigation askip
    const [inputs, setInputs] = useState({name: "", maxBudget:""});
    const [formValid, setFormValid] = useState(false);
    const userId = Number(localStorage.getItem("userId"));
    useEffect(() => {
        checkFormValidity();
    }, [inputs]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const nom = e.target.name;
        let value = e.target.value;
        if(nom === "name" && value.length > 12)
            value = value.slice(0,12);

        setInputs(values => ({...values, [nom]: value}));
    }

    function checkFormValidity(){
        setFormValid(!!inputs.name);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!formValid) return;
        const category = {name: inputs.name, maxBudget: Number(inputs.maxBudget), userId};
        if(onCategoryCreated){
            onCategoryCreated(category);
        }
        const form = e.target as HTMLFormElement;
        toast.success("Catégorie ajoutée avec succès !");
        form.reset();
        setFormValid(false);
        navigate("/categories/manager");
    }

    return <>
        <div>
            <form onSubmit={handleSubmit} className="form-category">
                <div className="div-category">
                    <h2 className="h2-category">Ajouter une catégorie</h2>
                    <label className="label-category">
                        Nom de la Catégorie <input type="text" name="name" className="input-category" maxLength={12} onChange={handleChange}/>
                    </label>
                    <br/>
                    <label className="label-category">
                        Budget Maximum <input type="number" step="any" name="maxBudget" className="input-category" min="1"
                                              onChange={handleChange}/>
                    </label>
                </div>
                <input type="submit" className="submit-category" disabled={!formValid}/>
            </form>
            <button onClick={() => navigate("/categories/manager")} className="submit-category">Retour</button>
        </div>
    </>
}