import {BudgetProvider} from "../context/BudgetContext.tsx";
import {Outlet} from "react-router";

export function BudgetLayout(){
    return <BudgetProvider>
        <Outlet/>
    </BudgetProvider>
}