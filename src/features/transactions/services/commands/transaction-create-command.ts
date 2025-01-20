export interface TransactionCreateCommand {
    amount : number;
    dateTransaction : Date;
    idCategory : number;
    idBudget : number;
    description : string;
}