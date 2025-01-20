import {Transaction} from "../types/transaction.ts";
import {useEffect, useState} from "react";

interface TransactionFormComponentProps {
    onTransactionCreated: (t: Transaction) => void;
}

export function TransactionFormComponent({onTransactionCreated}: TransactionFormComponentProps) {
    const [inputsDescription, setInputsDescription] = useState({description:""});
    const [inputsAmount, setInputsAmount] = useState({amount:""});


    useEffect(() => {
        checkFormValidity();
    },[inputsDescription]);

    function checkFormValidity() {
        setFormValid(!!inputsDescription.description);
    }
}

