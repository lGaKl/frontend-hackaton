import './App.css'
import {NavigationBarComponent} from "./core/components/navigation-bar/NavigationBarComponent.tsx";
import {Route, Routes} from "react-router";
import {Container} from "react-bootstrap"
import {HomeComponent} from "./core/components/HomeComponent.tsx";
import categoriesRoutes from "./features/categories/categories-routes.tsx";

function App() {
    return <>
        <NavigationBarComponent/>
        <Container className="mb-4">
            <Routes>
                <Route path="/" element={<HomeComponent/>} />
                {categoriesRoutes}
            </Routes>
        </Container>
    </>
}

export default App
