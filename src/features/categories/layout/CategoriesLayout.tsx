import {CategoryProvider} from "../context/CategoriesContext.tsx";
import {Outlet} from "react-router";

export function CategoriesLayout() {
    return <CategoryProvider>
        <Outlet/>
    </CategoryProvider>
}