import { useState, useEffect, useMemo } from "react";
import "./HomeComponent.css";
import { NavLink } from "react-router";
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

export function HomeComponent() {
    const snowflakes = Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="home-snowflake">
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

        const chartData = categoriesWithRemainingBudget.map((category) => ({
            angle: category.remainingBudget,
            label: category.name
        }));

        const totalCategoryBudget = chartData.reduce((sum, category) => sum + category.angle, 0);
        const remainingBudgetOutsideCategories = remainingBudget - totalCategoryBudget;

        if (remainingBudgetOutsideCategories > 0) {
            chartData.push({
                angle: remainingBudgetOutsideCategories,
                label: "reste"
            });
        }

        setData(chartData);
    }, [categoriesWithRemainingBudget, remainingBudget, budget]);

    const handleValueClick = (datapoint: RadialChartPoint) => {
        const category = categoriesWithRemainingBudget.find((cat) => cat.name === datapoint.label);
        if (category) {
            setSelectedCategory({
                name: category.name,
                maxBudget: category.maxBudget,
                percentageOfCategory: category.percentageOfCategory,
                percentageOfTotal: category.percentageOfTotal
            });
            setData((prevData) =>
                prevData.map((d) =>
                    d.label === datapoint.label ? { ...d, radius: 1.1, className: 'selected' } : { ...d, radius: 1, className: '' }
                )
            );
        }
    };

    const percentage = (remainingBudget / (budget?.total || 1)) * 100;
    return (
        <>
            <h1 className="home-title">Bienvenue</h1>
            <div className="home-nav-container">
                <Nav.Link to="/login" as={NavLink}> <span className="home-navlink">Se connecter</span> </Nav.Link><br/>
                <Nav.Link to="/register" as={NavLink}> <span className="home-navlink">S'enregistrer</span> </Nav.Link>
            </div>
            <div className="home-snowflakes" aria-hidden="true">
                {snowflakes}
            </div>
            <div className="home-chart-container">
                <h2 className="home-chart-title">Répartition du Budget</h2>
                <div className="home-chart-and-details">
                    <RadialChart
                        data={data}
                        width={500}
                        height={500}
                        onValueClick={handleValueClick}
                        className="home-radial-chart"
                    />
                    {selectedCategory && (
                        <div className="home-category-details">
                            <h3>Catégorie: {selectedCategory.name}</h3>
                            <p>Budget maximum : {selectedCategory.maxBudget} €</p>
                            <p>Pourcentage du budget total: {selectedCategory.percentageOfTotal.toFixed(2)}%</p>
                            <p>Pourcentage des dépenses de la catégorie: {selectedCategory.percentageOfCategory.toFixed(2)}%</p>
                        </div>
                    )}
                </div>
                <div className="home-total-budget">
                    <h2>Budget Total</h2>
                    <div style={{width: 300, height: 300}}>
                        <CircularProgressbar
                            value={percentage}
                            text={`${remainingBudget} € restants sur ${budget?.total} €`}
                            styles={buildStyles({
                                textSize: '12px',
                                pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                                textColor: '#f88',
                                trailColor: '#d6d6d6',
                                backgroundColor: '#3e98c7',
                            })}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}