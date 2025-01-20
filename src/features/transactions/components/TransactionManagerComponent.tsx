import {useTransactionDispatch} from "../contexts/TransactionContext.tsx";
import {Transaction} from "../types/transaction.ts";
import {postTransaction} from "../services/transaction-service.tsx";
import {TransactionFormComponent} from "./TransactionFormComponent.tsx";

export default function TransactionManagerComponent() {
    const dispatch = useTransactionDispatch();

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

    /*const onTransactionDeleted:  (transaction: Transaction) => void = transactionDeleted => {
        if(!transactionDeleted) return;

        const sendDeleteTransaction = async (transaction: Transaction) => {
            const response = await deleteTransaction(transaction.idBudget);
            if(response.ok) {
                dispatch({type: "delete", transaction: transaction});
            }else{
                throw ApiError.fromResponseJson(await response.json());
            }
        }
        sendDeleteTransaction(transactionDeleted);
    }

    const onTransactionUpdated: (transaction: Transaction) => void = transactionUpdated => {
        const sendUpdateTransaction = async (transaction: Transaction) => {
            const response = await updateTransaction(transaction.idTransaction!!,{
                amount: transaction.amount,
                dateTransaction: transaction.dateTransaction,
                idBudget: transaction.idBudget,
                idCategory: transaction.idCategory,
                description: transaction.description
            });
            if (!response.ok)
                throw new ApiError(await response.json())
        }
        sendUpdateTransaction(transactionUpdated);
    }*/

    return <>
        <TransactionFormComponent onTransactionCreated={onTransactionCreated}/>
    </>
}