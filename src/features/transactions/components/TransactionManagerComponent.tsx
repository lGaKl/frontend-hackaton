import {useTransactionDispatch} from "../contexts/TransactionContext.tsx";
import {Transaction} from "../types/transaction.ts";
import {postTransaction, updateTransaction} from "../services/transaction-service.tsx";
import TransactionFormComponent from "./TransactionFormComponent.tsx";
import {useLocation} from "react-router-dom";
import {ApiError} from "../../../shared/exceptions/ApiError.ts";
import {debounce} from "../../../shared/utils/Utils.ts";
import TransactionListComponent from "./TransactionListComponent.tsx";
import {TransactionCreateCommand} from "../services/commands/transaction-create-command.ts";

export default function TransactionManagerComponent() {
    const dispatch = useTransactionDispatch();
    const location = useLocation();

    const onTransactionCreated: (transaction: TransactionCreateCommand) => void = transaction => {
        const sendTransaction = async (transaction: TransactionCreateCommand) => {
            const transactionCreated = await postTransaction({
                amount: transaction.amount,
                date_transaction: transaction.date_transaction,
                description: transaction.description,
                budgetId: transaction.budgetId,
                categoryId: transaction.categoryId
            });
            dispatch({type: "add", transaction: transactionCreated});
        }
        sendTransaction(transaction);
    };

    const onTransactionUpdated: (transaction: Transaction) => void = debounce((transactionUpdated: Transaction) => {
        const sendUpdateTransaction = async (transaction: Transaction) => {
            const response = await updateTransaction({
                id: transaction.id,
                amount: transaction.amount,
                date_transaction: transaction.date_transaction,
                budgetId: transaction.budgetId,
                categoryId: transaction.categoryId,
                description: transaction.description
            });
            if (!response.ok)
                throw new ApiError(await response.json());
        };
        sendUpdateTransaction(transactionUpdated);
    },500);

    let content;
    switch (location.pathname) {
        case "/transactions/transactionForm":
            content = <TransactionFormComponent onTransactionCreated={onTransactionCreated}/>;
            break;
        case "/transactions/transactionList":
            content = <TransactionListComponent onTransactionUpdated={debounce(onTransactionUpdated, 500)} />;
            break;
        default:
            content = <div>Page not found</div>;
    }

    return <>
        {content}
    </>
}