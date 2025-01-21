export interface TransactionCreateCommand {
    amount : number;
    date_transaction : string;
    budgetId : number;
    categoryId : number;
    description : string;
}