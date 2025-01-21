import { Col, Row, Card, Button, Form, Modal } from "react-bootstrap";
import "./BudgetPageComponent.css";
import React, { useEffect, useState, useMemo } from "react";
import { Category } from "../../../features/categories/types/category.ts";
import { fetchCategories } from "../../../features/categories/services/category-service.tsx";
import { Budget } from "../../../features/budget/types/Budget.ts";
import { fetchBudgets } from "../../../features/budget/services/BudgetService.tsx";
import { Transaction } from "../../../features/transactions/types/transaction.ts";
import { fetchTransactions } from "../../../features/transactions/services/transaction-service.tsx";

export function BudgetPageComponent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [budget, setBudget] = useState<Budget | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newBudget, setNewBudget] = useState({ total: '', date: '' });

    useEffect(() => {
        loadBudget();
        loadCategories();
        loadTransactions();
    }, []);

    /* load data (budget, categories and transactions) */
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

    async function loadTransactions(): Promise<void> {
        try {
            const transactionsFromAPI = await fetchTransactions();
            setTransactions(transactionsFromAPI);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }

    /* ---------------------------------------------------------------------------------------------------- */

    const calculateRemainingBudget = () => {
        if (!budget) return 0;

        const totalSpent = transactions.reduce(
            (amount, transaction) => amount + parseFloat(transaction.amount.toString()), 0);

        return budget.total - totalSpent;
    };

    const remainingBudget = useMemo(calculateRemainingBudget, [budget, transactions]);

    const calculateRemainingBudgetByCategory = (categoryId: number | undefined) => {
        if (!categoryId) return 0;

        const categoryTransactions = transactions.filter((transaction) => transaction.categoryId === categoryId);

        const totalSpent = categoryTransactions.reduce(
            (amount, transaction) => amount + parseFloat(transaction.amount.toString()), 0);

        const category = categories.find((cat) => cat.id === categoryId);
        if (!category) return 0;

        return category.maxBudget - totalSpent;
    };

    const categoriesWithRemainingBudget = useMemo(() => {
        return categories.map((category) => ({
            ...category,
            remainingBudget: calculateRemainingBudgetByCategory(category.id),
        }));
    }, [categories, transactions]);

    /* show form for new budget */
    const handleShowForm = () => setShowForm(true);
    const handleCloseForm = () => setShowForm(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleCloseForm();
    };

    return (
        <>
            <h1 className="title-h1">Budget</h1>

            <Row className="g-3 mb-5">
                <Col md={6} sm={12}>
                    {/* Total budget and remaining budget */}
                    <Card className="budget-card">
                        <Card.Body>
                            <Card.Title>Budget Total</Card.Title>
                            <Card.Text>
                                {budget ? `${budget.total} €` : "- €"}
                            </Card.Text>
                            {!budget && (
                                <Button
                                    className="button-add"
                                    style={{
                                        backgroundColor:"#91a767",
                                        borderColor:"#91a767"}}
                                    onClick={handleShowForm}>
                                    Add Budget
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} sm={12}>
                    <Card className="budget-card">
                        <Card.Body>
                            <Card.Title>Budget restant</Card.Title>
                            <Card.Text>
                                {budget ? `${remainingBudget} €` : "Loading..."}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Display categories */}
            <Row className="g-3">
                <Col xs={12}>
                    <h3 className="title-h3">Your categories</h3>
                    <ul className="ul-category">
                        {categoriesWithRemainingBudget.length > 0 ? (
                            categoriesWithRemainingBudget.map((category) => (
                                <li key={category.id} className="li-category">
                                    <span className="span-category">{category.name}</span>
                                    <span className="span-category">
                                        Budget max: {category.maxBudget} €
                                    </span>
                                    <span className="span-category">
                                        Remaining budget: {category.remainingBudget} €
                                    </span>
                                </li>
                            ))
                        ) : (
                            <p className="p-no-found">No categories found :(</p>
                        )}
                    </ul>
                </Col>
            </Row>

            {/* Display form for new budget */}
            <Modal show={showForm} onHide={handleCloseForm}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new budget</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBudgetTotal">
                            <Form.Label style={{color:"black", fontSize:"2.rem", borderColor:"#91a767", marginTop:12, marginLeft:5}}>Total Budget</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter total budget"
                                style={{fontFamily:"Elephant, sans serif"}}
                                value={newBudget.total}
                                onChange={(e) => setNewBudget({ ...newBudget, total: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBudgetDate">
                            <Form.Label style={{color:"black", fontSize:"2.rem", borderColor:"#91a767", marginTop:12, marginLeft:5}}>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newBudget.date}
                                style={{fontFamily:"Elephant, sans serif"}}
                                onChange={(e) => setNewBudget({ ...newBudget, date: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" className="mt-3" style={{backgroundColor:"#91a767", borderColor:"#91a767"}}>
                            Save new budget
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}