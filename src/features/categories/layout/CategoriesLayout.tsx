import {CategoryProvider} from "../context/CategoriesContext.tsx";
import {Outlet} from "react-router";

export function CategoriesLayout() {
    console.log("je passes dans le layout");
    return <CategoryProvider>
        <Outlet/>
    </CategoryProvider>
}