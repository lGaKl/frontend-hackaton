import { useState, useEffect, useMemo } from "react";
import "./HomeComponent.css";
import {NavLink, useNavigate} from "react-router";
import { Nav } from "react-bootstrap";
import { Budget } from "../budget/types/Budget.ts";
import { Category } from "../categories/types/category.ts";
import { Transaction } from "../transactions/types/transaction.ts";
import { fetchBudgets } from "../budget/services/BudgetService.tsx";
import { fetchCategories } from "../categories/services/category-service.tsx";
import { fetchTransactions } from "../transactions/services/transaction-service.tsx";
import RadialChart from "./RadialChart.tsx";
import { RadialChartPoint } from "react-vis";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useAuth} from "../auth/AuthContext.tsx";
import Tutorial from "../tutorial/Tutorial.tsx";

export function HomeComponent() {

    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [runTutorial, setRunTutorial] = useState(false);

    const snowflakes = Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="snowflake">
            <div className="inner">❅</div>
        </div>
    ));

    const [budget, setBudget] = useState<Budget | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [data, setData] = useState<{ angle: number; label: string; radius?: number }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<{ name: string; maxBudget: number; percentageOfCategory: number; percentageOfTotal: number } | null>(null);

    useEffect(() => {
        loadBudget();
        loadCategories();
        loadTransactions();
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

    async function loadTransactions(): Promise<void> {
        try {
            const transactionsFromAPI = await fetchTransactions();
            setTransactions(transactionsFromAPI);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }

    const calculateRemainingBudget = () => {
        if (!budget) return 0;

        const totalSpent = transactions.reduce(
            (amount, transaction) => amount + parseFloat(transaction.amount.toString()), 0);

        return budget.total - totalSpent;
    };

    const remainingBudget = useMemo(calculateRemainingBudget, [budget, transactions]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const calculateRemainingBudgetByCategory = (categoryId: number | undefined) => {
        if (!categoryId) return { remainingBudget: 0, percentageOfCategory: 0 };

        const categoryTransactions = transactions.filter((transaction) => transaction.categoryId === categoryId);

        const totalSpent = categoryTransactions.reduce(
            (amount, transaction) => amount + parseFloat(transaction.amount.toString()), 0);

        const category = categories.find((cat) => cat.id === categoryId);
        if (!category) return { remainingBudget: 0, percentageOfCategory: 0 };

        const remainingBudget = category.maxBudget - totalSpent;
        const percentageOfCategory = (totalSpent / category.maxBudget) * 100;

        return { remainingBudget, percentageOfCategory };
    };

    const categoriesWithRemainingBudget = useMemo(() => {
        return categories.map((category) => {
            const { remainingBudget, percentageOfCategory } = calculateRemainingBudgetByCategory(category.id);
            return {
                ...category,
                remainingBudget,
                percentageOfCategory,
                percentageOfTotal: budget ? (category.maxBudget / budget.total) * 100 : 0
            };
        });
    }, [categories, transactions, budget]);

    useEffect(() => {
        if (!budget) return;

        const colors = [
            "red", "green", "gold", "darkred", "darkgreen",
            "blue", "silver", "darkblue", "lightblue", "pink"
        ];

        const chartData = categoriesWithRemainingBudget.map((category, index) => ({
            angle: category.remainingBudget,
            label: category.name,
            className: `radial-segment-${colors[index % colors.length]}`
        }));

        const totalCategoryBudget = chartData.reduce((sum, category) => sum + category.angle, 0);
        const remainingBudgetOutsideCategories = remainingBudget - totalCategoryBudget;

        if (remainingBudgetOutsideCategories > 0) {
            chartData.push({
                angle: remainingBudgetOutsideCategories,
                label: "reste",
                className: "radial-segment-white"
            });
        }

        setData(chartData);
    }, [categoriesWithRemainingBudget, remainingBudget, budget]);


    const handleValueClick = (datapoint: RadialChartPoint) => {
        setData((prevData) =>
            prevData.map((d) =>
                d.label === datapoint.label
                    ? { ...d, radius: d.radius === 1.1 ? 1 : 1.1 }
                    : { ...d, radius: 1 }
            )
        );
        const isSelected = selectedCategory?.name === datapoint.label;
        if (isSelected) {
            setSelectedCategory(null);
        } else {
            const category = categoriesWithRemainingBudget.find((cat) => cat.name === datapoint.label);
            if (category) {
                setSelectedCategory({
                    name: category.name,
                    maxBudget: category.maxBudget,
                    percentageOfCategory: category.percentageOfCategory,
                    percentageOfTotal: category.percentageOfTotal,
                });
            }
        }
    };

    const percentage = (remainingBudget / (budget?.total || 1)) * 100;
    return (
        <>
            {!isAuthenticated && (
                <div className="home-nav-container">
                    <h1 className="home-title">Bienvenue</h1>
                    <Nav.Link to="/login" as={NavLink}> <span className="home-navlink">Se connecter</span>
                    </Nav.Link><br/>
                    <Nav.Link to="/register" as={NavLink}> <span className="home-navlink">S'enregistrer</span>
                    </Nav.Link>
                </div>
            )}
            {isAuthenticated && (
                <div className="home-chart-container">
                    <h2 className="home-chart-title">Répartition du Budget</h2>
                    <div className="home-chart-background">
                        <div className="home-chart-overlay">
                            <CircularProgressbar
                                value={percentage}
                                styles={buildStyles({
                                    textSize: '7px',
                                    pathColor: `#146B3A`,
                                    trailColor: 'rgba(205, 184, 120, 0.5)',
                                    pathTransitionDuration: 5
                                })}
                            />
                            <div className="radial-chart-container">
                                <div className="home-chart-and-details">
                                    <RadialChart
                                        data={data}
                                        onValueClick={handleValueClick}
                                        className="home-radial-chart"
                                    />
                                </div>
                            </div>
                        </div>
                        {selectedCategory && (
                            <div className="home-category-details">
                                <h3 className="home-title-category">{selectedCategory.name}</h3>
                                <p className="category-data">
                                    <span className="category-home-label">Budget maximum :</span> <span
                                    className="span-home">{selectedCategory.maxBudget} €</span>
                                </p>
                                <p className="category-data">
                                    <span className="category-home-label">Pourcentage du budget total :</span> <span
                                    className="span-home">{selectedCategory.percentageOfTotal.toFixed(2)}%</span>
                                </p>
                                <p className="category-data">
                                    <span
                                        className="category-home-label">Pourcentage des dépenses de la catégorie :</span>
                                    <span
                                        className="span-home">{selectedCategory.percentageOfCategory.toFixed(2)}%</span>
                                </p>

                            </div>
                        )}
                    </div>


                    <div className="logout-button-container">
                        <button className="btn-logout" onClick={() => setRunTutorial(true)}>Tutoriel</button>
                        <Tutorial run={runTutorial} onFinish={() => setRunTutorial(false)} />
                        <button className="btn-logout" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
            <div className="home-snowflakes" aria-hidden="true">
                {snowflakes}
            </div>
        </>
    );
}