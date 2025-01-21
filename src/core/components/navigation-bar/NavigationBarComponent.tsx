import {NavLink} from "react-router";
import {Container, Nav, Navbar as NavbarBs, NavDropdown} from "react-bootstrap"
import "./NavigationBarComponent.css";

export function NavigationBarComponent() {
    return (
        <NavbarBs sticky="top">
            <Container>
                <Nav className="justify-content-center w-100" style={{gap: 10}}>

                    <Nav.Link to="/" as={NavLink}>
                        Home
                    </Nav.Link>

                    <NavDropdown
                        title="Transactions"
                        id="collapsible-nav-dropdown"
                        className="vertical-dropdown"
                    >
                        <NavDropdown.Item as={NavLink} to="/transactions/add">Add transaction</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/transactions/modify">Update transaction</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/transactions/remove">Remove transaction</NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link to="/budget" as={NavLink}>Budget</Nav.Link>
                    <Nav.Link to="/categories/manager" as={NavLink} className="nav-link-custom"> Categories </Nav.Link>
                </Nav>
            </Container>
        </NavbarBs>
    );
}