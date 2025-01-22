import { useTransactions } from "../contexts/TransactionContext.tsx";
import "./TransactionComponent.css";

export default function TransactionsComponent() {
    const transactions = useTransactions();

    const getMonthName = (monthIndex: number) => {
        const months = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];
        return months[monthIndex];
    };

    const exportToCSV = () => {
        if (transactions.length === 0) {
            alert("Aucune transaction à exporter.");
            return;
        }

        const now = new Date();
        const monthName = getMonthName(now.getMonth());

        const csvHeader = "Description,Montant,Date,Categorie\n";
        const csvRows = transactions.map(transaction =>
            `"${transaction.description}","${transaction.amount}","${transaction.date_transaction}","${transaction.categoryId}"`
        );
        const csvContent = csvHeader + csvRows.join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Transactions_${monthName}.csv`;
        link.click();
    };

    return (
        <div className="div-liste">
            <h1 className="h1-transactions">Liste des transactions</h1>
            <button
                type="button"
                className="button-transaction-liste"
                onClick={exportToCSV}
            >
                Exporter les transactions
            </button>
            <ul className="ul-transactions">
                {transactions.map((transaction, index) => (
                    <li key={transaction.id} className="li-transactions">
                        <h2 className="span-transactions-title">Transaction #{index + 1}</h2>
                        <div className="div-transactions">
                            <>
                                <span className="span-transactions">
                                    Description: <span className="span-transactions-data">{transaction.description}</span>
                                </span>
                                <span className="span-transactions">
                                    Montant: <span className="span-transactions-data">{transaction.amount} €</span>
                                </span>
                                <span className="span-transactions">
                                    Date: <span className="span-transactions-data">{transaction.date_transaction}</span>
                                </span>
                                <span className="span-transactions">
                                    Catégorie: <span className="span-transactions-data">{transaction.categoryId}</span>
                                </span>
                            </>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
