import {TransactionCreateCommand} from "./commands/transaction-create-command.ts";
import {Transaction} from "../types/transaction.ts";
import {TransactionUpdateCommand} from "./commands/transaction-update-command.ts";

const TRANSACTION_API_URL = import.meta.env.VITE_API_URL + "/transactions";

export const postTransaction: (transaction: TransactionCreateCommand) => Promise<Transaction> = async (transaction: TransactionCreateCommand)=>{
    const response = await fetch (TRANSACTION_API_URL,{
        method: "POST",
        headers:{
            "content-Type" : "application/json"
        },
        body: JSON.stringify(transaction)
    });
    return await response.json();
}

export const fetchTransactions: () => Promise<Transaction[]> = async () =>{
    const response = await fetch (TRANSACTION_API_URL);
    return await response.json();
}

export const deleteTransaction : (transactionId: number) => Promise<Response> = async (id : number)=>{
 return await fetch (`${TRANSACTION_API_URL}/${id}`,{
     method: "DELETE",
    });
}

export const UpdateTransaction : (id: number, transaction: TransactionUpdateCommand) => Promise<Response> = async(id:number, transaction: TransactionUpdateCommand )=>{
    return await fetch (`${TRANSACTION_API_URL}/${id}`,{
        method: "PATCH",
        headers:{
            "content-Type" : "application/json"
        },
        body:JSON.stringify(transaction)
    });
}