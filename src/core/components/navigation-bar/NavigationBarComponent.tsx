import { NavLink } from "react-router";
import { Container, Nav, Navbar as NavbarBs, NavDropdown } from "react-bootstrap";
import "./NavigationBarComponent.css";

export function NavigationBarComponent() {

    return (
        <>
            <NavbarBs sticky="top">
                <Container>
                    <Nav className="justify-content-center w-100" style={{ gap: 10 }}>
                        <Nav.Link to="/" as={NavLink} className="nav-link-accueil">
                            Accueil
                        </Nav.Link>
                        <NavDropdown
                            title="Transactions"
                            id="collapsible-nav-dropdown"
                            className="nav-link-transactions vertical-dropdown"
                        >
                            <NavDropdown.Item as={NavLink} to="/transactions/transactionForm">Ajout</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/transactions/transactionList">Mise à jour</NavDropdown.Item>
                            <NavDropdown.Item href="/transactions/transactions">Liste</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link to="/budget/manager" as={NavLink} className="nav-link-budget">
                            Budget
                        </Nav.Link>
                        <Nav.Link to="/categories/manager" as={NavLink} className="nav-link-categories">
                            Catégories
                        </Nav.Link>
                    </Nav>
                </Container>
            </NavbarBs>
        </>
    );
}
