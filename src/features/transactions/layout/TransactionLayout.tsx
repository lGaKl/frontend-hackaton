import {TransactionProvider} from "../contexts/TransactionContext.tsx";
import {Outlet} from "react-router";

export function TransactionLayout(){
    return <TransactionProvider>
        <Outlet/>
    </TransactionProvider>
}