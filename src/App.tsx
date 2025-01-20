import './App.css'
import {NavigationBarComponent} from "./core/components/navigation-bar/NavigationBarComponent.tsx";
import {Route, Routes} from "react-router";
import {HomeComponent} from "./HomeComponent.tsx";
import transactionRoutes from "./features/transaction-routes.tsx";

function App() {
    return <>
        <NavigationBarComponent/>
        <main>
            <Routes>
                <Route index element={<HomeComponent/>}></Route>
                {transactionRoutes}
            </Routes>
        </main>
    </>
}

export default App
