export interface TransactionUpdateCommand {
    amount : number;
    dateTransaction : Date;
    idCategory : number;
    idBudget : number;
    description : string;
}