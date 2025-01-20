import {Transaction} from "../types/transaction.ts";
import {FormEvent, useEffect, useState} from "react";

interface TransactionFormComponentProps {
    onTransactionCreated: (t: Transaction) => void;
}

export function TransactionFormComponent({onTransactionCreated}: TransactionFormComponentProps) {
    const [inputsDescription] = useState({description:""});
    const [inputsAmount] = useState({amount: 0});
    const [formValid, setFormValid] = useState(false);



    useEffect(() => {
        checkFormValidity();
        checkData();
    },[inputsDescription, inputsAmount]);

    // looking if the informations are write implemented
    function checkData() {
        const isDescriptionValid=!!inputsDescription.description;
        const isAmountValid=!!inputsAmount.amount && inputsAmount.amount>0;
        return (isDescriptionValid && isAmountValid);
    }

    //checking if the button can be clickable by checking the encoded informations
    function checkFormValidity() {
        setFormValid(!!inputsDescription.description || !!inputsAmount.amount);
    }

    function handleSubmit(e : FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(!formValid) return;
        let transaction = {
            amount: inputsAmount.amount,
            dateTransaction: new Date(),
            //Ajouter idCategory et idBudget
            idBudget: 1,
            idCategory: 1,
            description: inputsDescription.description
        };
        onTransactionCreated(transaction);
        const form = e.target as HTMLFormElement;
        form.reset();
        setFormValid(false);
    }

    return <form onSubmit={handleSubmit}>
        <div>
            <h1>
                Add an Transaction
            </h1>
            <label>
                Description
            </label>
            <input type="text" name="Description"/>
            <label>
                Amount
            </label>
            <input type="number" name="Amount"/>
            <input type="submit" disabled={formValid}/>
        </div>
    </form>

}

