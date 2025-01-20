import {Transaction} from "../types/transaction.ts";
import {FormEvent, useEffect, useState} from "react";

interface TransactionFormComponentProps {
    onTransactionCreated: (t: Transaction) => void;
}

export function TransactionFormComponent({onTransactionCreated}: TransactionFormComponentProps) {
    const [formValid, setFormValid] = useState(false);
    const [inputsDescription, setInputsDescription] = useState({ description: "" });
    const [inputsAmount, setInputsAmount] = useState({ amount: 0 });

    function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputsDescription({ description: e.target.value });
    }

    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputsAmount({ amount: parseFloat(e.target.value) });
    }

    useEffect(() => {
        checkFormValidity();
    }, [inputsDescription, inputsAmount]);

    function checkFormValidity() {
        const isDescriptionValid = !!inputsDescription.description;
        const isAmountValid = !!inputsAmount.amount && inputsAmount.amount > 0;
        setFormValid(isDescriptionValid && isAmountValid);
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

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1>Add a Transaction</h1>
                <label>Description</label>
                <input type="text" name="Description" onChange={handleDescriptionChange} />
                <label>Amount</label>
                <input type="number" name="Amount" onChange={handleAmountChange} />
                <input type="submit" disabled={!formValid} />
            </div>
        </form>
    );


}

