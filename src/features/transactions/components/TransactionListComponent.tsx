import {Transaction} from "../types/transaction.ts";
import {useTransactionDispatch, useTransactions} from "../contexts/TransactionContext.tsx";
import {ChangeEvent} from "react";

interface TransactionListComponentProps {
    onTransactionUpdated: (transaction: Transaction) => void;
}

export function TransactionListComponent({onTransactionUpdated}: TransactionListComponentProps) {
    const dispatch = useTransactionDispatch();
    const transactions = useTransactions();

    function processTransactionUpdating(e: ChangeEvent<HTMLInputElement>, transaction: Transaction) {
        const value = e.target.value;
        switch (e.target.name){
            case "amount":
                transaction.amount = Number(value);
                break;
            case "dateTransaction":
                transaction.dateTransaction = new Date(value);
                break;
            case  "idBudget":
                transaction.idBudget = Number(value);
                break;
            case "idCategory":
                transaction.idCategory = Number(value);
                break;
            case "description":
                transaction.description = value;
                break;
        }
        dispatch ({type: "update", transaction: transaction});
        onTransactionUpdated(transaction);
    }

    const transactionLiElements = transactions.map(transaction =>
        <li key={transaction.idTransaction}>
            <span>#{transaction.idTransaction}</span>
            <div>
                <input type="text" value={transaction.description} name={'description'} onChange={(e) => processTransactionUpdating(e, transaction)}/>
                <input type="number" value={transaction.amount} name={'amount'} onChange={(e) => processTransactionUpdating(e, transaction)}/>
                <input type="date" value={transaction.dateTransaction.toISOString().split("T")[0]} onChange={(e) => processTransactionUpdating(e, transaction)}/>
            </div>

        </li>
    );
    return <ul>{transactionLiElements}</ul>
}