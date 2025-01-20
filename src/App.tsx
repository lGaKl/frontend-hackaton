import './App.css'
import {NavigationBarComponent} from "./core/components/navigation-bar/NavigationBarComponent.tsx";
import {Route, Routes} from "react-router";
import transactionRoutes from "./features/transaction-routes.tsx";
import {Container} from "react-bootstrap"
import {BudgetPageComponent} from "./core/components/budget-page/BudgetPageComponent.tsx";
import categoriesRoutes from "./features/categories/categories-routes.tsx";
import {HomeComponent} from "./core/components/HomeComponent.tsx";

function App() {
    return <>
        <NavigationBarComponent/>
        <Container className="mb-4">
            <Routes>
                <Route path="/" element={<HomeComponent/>} />
                {categoriesRoutes}
                <Route path="/budget" element={<BudgetPageComponent/>} />
                <Route index element={<HomeComponent/>}></Route>
                {transactionRoutes}
            </Routes>
        </Container>
    </>
}

export default App
