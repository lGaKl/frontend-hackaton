export interface TransactionCreateCommand {
    amount : number;
    date_transaction : string;
    description : string;
    budgetId : number;
    categoryId : number;
}