import './App.css'
import {NavigationBarComponent} from "./core/components/navigation-bar/NavigationBarComponent.tsx";
import {Route, Routes} from "react-router";
import {Container} from "react-bootstrap"
import {HomeComponent} from "./features/home/HomeComponent.tsx";
import {BudgetPageComponent} from "./core/components/budget-page/BudgetPageComponent.tsx";
import categoriesRoutes from "./features/categories/categories-routes.tsx";
import {LoginComponent} from "./core/components/login/LoginComponent.tsx";
import {RegisterComponent} from "./core/components/register/RegisterComponent.tsx";

function App() {
    return <>
        <NavigationBarComponent/>
        <Container className="mb-4">
            <Routes>
                <Route path="/" element={<HomeComponent/>} />
                {categoriesRoutes}
                <Route path="/budget" element={<BudgetPageComponent/>} />
                <Route path="/login" element={<LoginComponent/>} />
                <Route path="/register" element={<RegisterComponent/>} />
            </Routes>
        </Container>
    </>
}

export default App
