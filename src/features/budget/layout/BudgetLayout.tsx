import {BudgetProvider} from "../BudgetContext.tsx";
import {Outlet} from "react-router";

export function TransactionLayout(){
    return <BudgetProvider>
        <Outlet/>
    </BudgetProvider>
}