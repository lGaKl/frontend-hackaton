import { useTransactions } from "../contexts/TransactionContext.tsx";
import "./TransactionComponent.css"

export default function TransactionsComponent() {
    const transactions = useTransactions();

    return (
        <div className="div-liste">
            <h1 className="h1-transactions">Liste des transactions</h1>
            <button type="submit" className="button-transaction-liste">Exporter les transactions</button>
            <ul className="ul-transactions">
                {transactions.map((transaction, index) => (
                    <li key={transaction.id} className="li-transactions">
                        <h2 className="span-transactions-title">Transaction #{index + 1}</h2>
                        <div className="div-transactions">
                            <>
                                <span className="span-transactions">Description: <span className="span-transactions-data">{transaction.description}</span></span>
                                <span className="span-transactions">Montant: <span className="span-transactions-data">{transaction.amount} €</span></span>
                                <span className="span-transactions">Date: <span className="span-transactions-data">{transaction.date_transaction}</span></span>
                                <span className="span-transactions">Catégorie: <span className="span-transactions-data">{transaction.categoryId}</span></span>
                            </>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}