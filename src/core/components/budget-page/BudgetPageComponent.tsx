import { Col, Row, Card } from "react-bootstrap";
import "./BudgetPageComponent.css";
import {useEffect, useState} from "react";
import {Category} from "../../../features/categories/types/category.ts";
import {fetchCategories} from "../../../features/categories/services/category-service.tsx";

export function BudgetPageComponent() {
    const totalBudget = 3500;
    const remainingBudget = 1250.49;

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        loadCategories();
    },[]);

    async function loadCategories() : Promise<void> {
        const categoriesFromAPI = await fetchCategories();
        setCategories(categoriesFromAPI);
    }

    return (
        <>
            <h1 className="title-h1">Budget</h1>

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

            <Row className="g-3">
                <Col xs={12}>
                    <h3 className="title-h3">Your categories</h3>
                    <ul className="ul-category">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <li key={category.id} className="li-category">
                                    <span className="span-category">{category.nameCategory}</span>
                                    <span className="span-category">Budget max: {category.maxBudget} €</span>
                                </li>
                            ))
                        ) : (
                            <p className="p-no-found">No categories founded :(</p>
                        )}
                    </ul>
                </Col>
            </Row>
        </>
    );
}
