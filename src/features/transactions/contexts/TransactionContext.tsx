import {Transaction} from "../types/transaction.ts";
import {createContext, ReactNode, useContext, useEffect, useReducer} from "react";
import {fetchTransactions} from "../services/transaction-service.tsx";

export interface Action{
    type : string;
    transaction: Transaction;
}

const TransactionContext = createContext<Transaction[]>([]);
const TransactionDispatchContext = createContext<(action: Action)=> void >(null!!);

function reducer (transactions: Transaction[], action: Action){
    switch (action.type){
        case "add":
            return [...transactions, action.transaction];
        case "update" :
            return transactions.map(transaction =>transaction.idTransaction ==action.transaction.idTransaction? action.transaction : transaction);
        case "delete":
                return  transactions.filter(transaction =>transaction.idTransaction !== action.transaction.idTransaction );
                default:
                    throw Error("Unknown action type " + action.type);
    }
}

export function TransactionProvider({children}:{children: ReactNode}){
    const [transactions,dispatch] = useReducer(reducer, []);

    useEffect(()=>{
        const getData = async () => {
            const transactions= await fetchTransactions();
            transactions.forEach(transaction=>dispatch({type: "add", transaction: transaction}));
        }
        getData();
    },[]);

    return<>
        <TransactionContext.Provider value={transactions}>
            <TransactionDispatchContext.Provider value={dispatch}>
                {children}
            </TransactionDispatchContext.Provider>
        </TransactionContext.Provider>
    </>
}

export const UseTransactions = ()=> useContext(TransactionContext);

export const UseTransactionDispatch = () => useContext(TransactionDispatchContext);