import './App.css'
import {NavigationBarComponent} from "./core/components/navigation-bar/NavigationBarComponent.tsx";
import {Route, Routes} from "react-router";
import transactionRoutes from "./features/transaction-routes.tsx";
import {Container} from "react-bootstrap"
import {HomeComponent} from "./features/home/HomeComponent.tsx";
import categoriesRoutes from "./features/categories/categories-routes.tsx";
import {LoginComponent} from "./core/components/login/LoginComponent.tsx";
import {RegisterComponent} from "./core/components/register/RegisterComponent.tsx";
import BudgetManagerComponent from "./features/budget/components/BudgetManagerComponent.tsx";
import {BudgetLayout} from "./features/budget/layout/BudgetLayout.tsx";
import {BudgetPageComponent} from "./features/budget/components/BudgetPageComponent.tsx";


function App() {
    return <>
        <NavigationBarComponent/>
        <Container className="mb-4">
            <Routes>
                <Route path="/" element={<HomeComponent/>} />
                {categoriesRoutes}
                <Route index element={<HomeComponent/>}></Route>
                <Route path="budget" element={<BudgetLayout />}>
                    <Route path="manager" element={<BudgetPageComponent />} />
                    <Route path="newBudget" element={<BudgetManagerComponent />} />
                </Route>
                {transactionRoutes}
                <Route path="/login" element={<LoginComponent/>} />
                <Route path="/register" element={<RegisterComponent/>} />
            </Routes>
        </Container>
    </>
}

export default App
