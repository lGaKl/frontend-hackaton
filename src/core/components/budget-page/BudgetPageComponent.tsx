import {Col, Row, Card} from "react-bootstrap";
import categoriesItems from "../../../data/categories.json";
import {BudgetItemsComponent} from "../budget-items/BudgetItemsComponent.tsx";

export function BudgetPageComponent() {
    const totalBudget = 3500;
    const remainingBudget = 1250.49;

    return (
        <>
            <h1>Budget</h1>

            <Row className="g-3 mb-5">
                <Col md={6} sm={12}>
                    <Card className="budget-card">
                        <Card.Body>
                            <Card.Title>Total Budget</Card.Title>
                            <Card.Text>{totalBudget} €</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} sm={12}>
                    <Card className="budget-card">
                        <Card.Body>
                            <Card.Title>Remaining Budget</Card.Title>
                            <Card.Text>{remainingBudget} €</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Affichage des catégories sous forme de cartes */}
            <Row md={2} xs={1} lg={3} className="g-3">
                {categoriesItems.map((item) => (
                    <Col key={item.id}>
                        <BudgetItemsComponent totalBudget={totalBudget} remainingBudget={remainingBudget} {...item} />
                    </Col>
                ))}
            </Row>
        </>
    );
}
