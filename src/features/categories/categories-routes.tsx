import {Route} from "react-router";
import {CategoriesLayout} from "./layout/CategoriesLayout.tsx";
import {SuspenseWrapper} from "../../shared/utils/SuspenseWrapper.tsx";

export default [
    <Route path="categories" key="categories" element={<CategoriesLayout/>}>
        <Route path="manager" element={
            <SuspenseWrapper key="category-manager" importFn={() => import("./components/CategoryManagerComponent.tsx")}/>
        }/>

        <Route path="add" element={
            <SuspenseWrapper key="category-add" importFn={() => import("./components/CategoryManagerFormComponent.tsx")}/>
        }/>
    </Route>
]