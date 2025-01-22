import {Route} from "react-router";
import {TransactionLayout} from "./transactions/layout/TransactionLayout.tsx";
import {SuspenseWrapper} from "../shared/utils/SuspenseWrapper.tsx";

export default [
    <Route path="transactions" key="transactions" element={<TransactionLayout/>}>
        <Route path="transactionForm" element={
            <SuspenseWrapper key="transaction-form" importFn={() => import("./transactions/components/TransactionFormComponent.tsx")}/>
        }/>
        <Route path="transactionList" element={
            <SuspenseWrapper key="transaction-list" importFn={() => import("./transactions/components/TransactionManagerComponent.tsx")}/>
        }/>
    </Route>
];