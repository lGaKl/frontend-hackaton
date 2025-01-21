import { Card } from "react-bootstrap";
import "./BudgetItemsComponent.css";

type CategoryItemsProps = {
    id: number;
    name: string;
    imgUrl: string;
    totalBudget: number;
    remainingBudget: number;
};

export function BudgetItemsComponent({ id, name, imgUrl, totalBudget, remainingBudget }: CategoryItemsProps) {
    return (
        <Card className="category-card">
            {/*<Card.Img
                variant="top"
                src={imgUrl}
                width="300px"
                height="300px"
                style={{ objectFit: "cover" }}
            />*/}
            <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
                    <span className="fs-4">{imgUrl}</span>
                </Card.Title>
                <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
                    <span className="fs-4">{name}</span>
                </Card.Title>
                <Card.Text>
                    <strong>Total Budget: </strong> {totalBudget} €
                </Card.Text>
                <Card.Text>
                    <strong>Remaining: </strong> {remainingBudget} €
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
