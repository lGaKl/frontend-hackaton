import {NavLink} from "react-router";
import {Container, Nav, Navbar as NavbarBs, NavDropdown} from "react-bootstrap"
import "./NavigationBarComponent.css";

export function NavigationBarComponent() {
    return (
        <NavbarBs sticky="top">
            <Container>
                <Nav className="justify-content-center w-100" style={{gap: 10}}>

                    <Nav.Link to="/" as={NavLink}>
                        Accueil
                    </Nav.Link>

                        <NavDropdown
                            title="Transactions"
                            id="collapsible-nav-dropdown"
                            className="vertical-dropdown"
                        >
                            <NavDropdown.Item as={NavLink} to="/transactions/transactionForm">Ajout</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/transactions/transactionList">Mise à jours</NavDropdown.Item>
                            <NavDropdown.Item href="/transactions/transactions">Transactions</NavDropdown.Item>
                        </NavDropdown>

                    <Nav.Link to="/budget/manager" as={NavLink}>Budget</Nav.Link>
                    <Nav.Link to="/categories/manager" as={NavLink} className="nav-link-custom"> Categories </Nav.Link>
                </Nav>
            </Container>
        </NavbarBs>
    );
}