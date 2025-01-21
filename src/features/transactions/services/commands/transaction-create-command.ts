export interface TransactionCreateCommand {
    amount : number;
    dateTransaction : Date;
    idBudget : number;
    idCategory : number;
    description : string;
}