import "./HomeComponent.css";
import {NavLink} from "react-router";
import {Nav} from "react-bootstrap";

export function HomeComponent() {
    const snowflakes = Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="snowflake">
            <div className="inner">❅</div>
        </div>
    ));
  
    return (
        <>
            <h1 className="home-title">Bienvenue</h1>
            <div className="nav-container">
                <Nav.Link to="/login" as={NavLink} > <span className="navlink">Login</span> </Nav.Link><br/>
                <Nav.Link to="/register" as={NavLink} > <span className="navlink">Register</span> </Nav.Link>
            </div>
            <div className="snowflakes" aria-hidden="true">
                {snowflakes}
            </div>
        </>
    );
}

