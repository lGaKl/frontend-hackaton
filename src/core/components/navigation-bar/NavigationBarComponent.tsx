import {NavLink} from "react-router";
import "./NavigationBarComponent.css";

export function NavigationBarComponent() {
    return <nav className={"navigation-bar"}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="transaction">Transaction</NavLink>
    </nav>
}