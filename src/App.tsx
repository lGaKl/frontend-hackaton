import './App.css'
import {NavigationBarComponent} from "./core/components/navigation-bar/NavigationBarComponent.tsx";
import {Route, Routes} from "react-router";
import {HomeComponent} from "./HomeComponent.tsx";

function App() {
    return <>
        <NavigationBarComponent/>
        <main>
            <Routes>
                <Route index element={<HomeComponent/>}></Route>
            </Routes>
        </main>
    </>
}

export default App
