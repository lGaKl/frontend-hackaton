import {Route} from "react-router";
import {TransactionLayout} from "./transactions/layout/TransactionLayout.tsx";
import {SuspenseWrapper} from "../shared/utils/SuspenseWrapper.tsx";


export default[
    <Route path="transactions" key="transactions" element={<TransactionLayout/>}>
        <Route path="transactionManager" element={
            <SuspenseWrapper key="transaction-manager" importFn={()=> import("./transactions/components/TransactionManagerComponent.tsx") }/>
        }/>
    </Route>
]