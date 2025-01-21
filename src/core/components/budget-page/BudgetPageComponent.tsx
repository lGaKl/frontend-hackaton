import { Col, Row, Card } from "react-bootstrap";
import "./BudgetPageComponent.css";
import { useEffect, useState } from "react";
import { Category } from "../../../features/categories/types/category.ts";
import { fetchCategories } from "../../../features/categories/services/category-service.tsx";
import { Budget } from "../../../features/budget/types/Budget.ts";
import { fetchBudgets } from "../../../features/budget/services/BudgetService.tsx";

export function BudgetPageComponent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [budget, setBudget] = useState<Budget | null>(null); // Stocke le budget principal (ou global).

    useEffect(() => {
        loadBudget();
        loadCategories();
    }, []);

    async function loadBudget(): Promise<void> {
        try {
            const budgetFromAPI = await fetchBudgets();
            if (budgetFromAPI.length > 0) {
                setBudget(budgetFromAPI[0]);
            }
        } catch (error) {
            console.error("Error fetching budget:", error);
        }
    }

    async function loadCategories(): Promise<void> {
        try {
            const categoriesFromAPI = await fetchCategories();
            setCategories(categoriesFromAPI);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    return (
        <>
            <h1 className="title-h1">Budget</h1>

            <Row className="g-3 mb-5">
                <Col md={6} sm={12}>
                    <Card className="budget-card">
                        <Card.Body>
                            <Card.Title>Total Budget</Card.Title>
                            <Card.Text>
                                {budget ? `${budget.total} €` : "Loading..."}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} sm={12}>
                    <Card className="budget-card">
                        <Card.Body>
                            <Card.Title>Remaining Budget</Card.Title>
                            <Card.Text>
                                ... €
                            </Card.Text>
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
                                    <span className="span-category">
                                        Budget max: {category.maxBudget} €
                                    </span>
                                    <span className="span-category">
                                        Remaining budget: ... €
                                    </span>
                                </li>
                            ))
                        ) : (
                            <p className="p-no-found">No categories found :(</p>
                        )}
                    </ul>
                </Col>
            </Row>
        </>
    );
}
