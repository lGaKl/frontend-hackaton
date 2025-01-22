import {useTransactionDispatch} from "../contexts/TransactionContext.tsx";
import {Transaction} from "../types/transaction.ts";
import {postTransaction, updateTransaction} from "../services/transaction-service.tsx";
import TransactionFormComponent from "./TransactionFormComponent.tsx";
import {useLocation} from "react-router-dom";
import TransactionListComponent from "./TransactionListComponent.tsx";
import {ApiError} from "../../../shared/exceptions/ApiError.ts";

export default function TransactionManagerComponent() {
    const dispatch = useTransactionDispatch();
    const location = useLocation();

    const onTransactionCreated: (transaction: Transaction) => void = transaction => {
        const sendTransaction = async (transaction: Transaction) => {
            const transactionCreated = await postTransaction({
                amount: transaction.amount,
                dateTransaction: transaction.dateTransaction,
                idBudget: transaction.idBudget,
                idCategory: transaction.idCategory,
                description: transaction.description
            });
            dispatch({type: "add", transaction: transactionCreated});
        }
        sendTransaction(transaction);
    }

    const onTransactionUpdated: (transaction: Transaction) => void = transactionUpdated => {
        const sendUpdateTransaction = async (transaction: Transaction) => {
            const response = await updateTransaction(transaction.id!,{
                amount: transaction.amount,
                date_transaction: transaction.date_transaction,
                description: transaction.description,
                budgetId: transaction.budgetId,
                categoryId: transaction.categoryId,

            });
            if (!response.ok)
                throw new ApiError(await response.json())
        }
        sendUpdateTransaction(transactionUpdated);
    }

    let content;
    switch (location.pathname) {
        case "/transactions/transactionForm":
            content = <TransactionFormComponent onTransactionCreated={onTransactionCreated}/>;
            break;
        case "/transactions/transactionList":
            content = <TransactionListComponent onTransactionUpdated={onTransactionUpdated} />;
            console.log("hello");
            break;
        default:
            content = <div>Page not found</div>;
    }

    return <>
        {content}
    </>
}