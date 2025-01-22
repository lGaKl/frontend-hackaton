export interface Transaction {
    id?: number
    amount : number;
    date_transaction : string;
    description : string;
    budgetId : number;
    categoryId : number;
}
