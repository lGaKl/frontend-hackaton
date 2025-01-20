export interface TransactionUpdateCommand {
    amount : number;
    dateTransaction : Date;
    idBudget : number;
    idCategory : number;
    description : string;
}