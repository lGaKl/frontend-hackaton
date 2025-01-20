    import {NavLink} from "react-router";
    import {Container, Nav, Navbar as NavbarBs} from "react-bootstrap"
    import "./NavigationBarComponent.css";

    export function NavigationBarComponent() {
        return (
            <NavbarBs sticky="top" className="bg-white shadow-sm">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link to="/" as={NavLink} className="nav-link-custom">
                            Home
                        </Nav.Link>

                        <Nav.Link to="/transactions" as={NavLink} className="nav-link-custom">
                            Transactions
                        </Nav.Link>

                        {/*<NavDropdown title="Transactions" id="basic-nav-dropdown" className="nav-link-custom">
                            <NavDropdown.Item as={NavLink} to="/transactions/add">
                                Add Transaction
                            </NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/transactions/update">
                                Update Transaction
                            </NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/transactions/delete">
                                Delete Transaction
                            </NavDropdown.Item>
                        </NavDropdown>*/}

                        <Nav.Link to="/budget" as={NavLink} className="nav-link-custom">
                            Budget
                        </Nav.Link>
                    </Nav>
                </Container>
            </NavbarBs>
        );
    }