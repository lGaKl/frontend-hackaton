    import {NavLink} from "react-router";
    import {Container, Nav, Navbar, Navbar as NavbarBs, NavDropdown} from "react-bootstrap"
    import "./NavigationBarComponent.css";

    export function NavigationBarComponent() {
        return (
            <NavbarBs sticky="top" className="bg-white shadow-sm">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link to="/" as={NavLink} className="nav-link-custom">
                            Home
                        </Nav.Link>

                        <Navbar.Collapse id="responsive-navbar-nav" className="nav-link-custom">
                            <Nav className="nav-link-custom">
                                <NavDropdown
                                    title="Transactions"
                                    id="collapsible-nav-dropdown"
                                    className="vertical-dropdown"
                                >
                                    <NavDropdown.Item as={NavLink} to="/transactions/add">Add transaction</NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/transactions/modify">Update transaction</NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/transactions/remove">Remove transaction</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>

                        <Nav.Link to="/budget" as={NavLink} className="nav-link-custom">
                            Budget
                        </Nav.Link>

                    <Nav.Link to="/categories/manager" as={NavLink} className="nav-link-custom"> Categories </Nav.Link>
                    </Nav>
                </Container>
            </NavbarBs>
        );
    }