import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import "./NewBudgetComponent.css";
import {BudgetCreateCommand} from "../../../features/budget/services/commands/BudgetCreateCommand.ts";
import {postBudget} from "../../../features/budget/services/BudgetService.tsx";

export function NewBudgetComponent() {
    const navigate = useNavigate();
    const [inputBudget, setInputBudget] = useState({ total: 0, date: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        try {
            const newBudget: BudgetCreateCommand = {
                total: inputBudget.total,
                date_budget: new Date().toISOString().split('T')[0]
            };
            console.log("Budget to be submitted:", newBudget);

            await postBudget(newBudget);
            navigate("/budget");
        } catch (error) {
            console.error("Error submitting budget:", error);
            setError('Failed to submit budget. Please try again.');
        }

        const form = e.target as HTMLFormElement;
        form.reset();
    };

    const handleBackClick = () => {
        navigate("/budget");
    };

    return (
        <div className="form-container">
            <h2 className="title-h2">Add New Budget</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="total">Total Budget</label>
                    <input
                        id="total"
                        type="number"
                        value={inputBudget.total}
                        onChange={(e) => setInputBudget({ ...inputBudget, total: parseFloat(e.target.value) })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="month"
                        value={inputBudget.date}
                        onChange={(e) => setInputBudget({ ...inputBudget, date: e.target.value })}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Save Budget</button>
                <button type="button" onClick={handleBackClick} className="back-button">Back</button>
            </form>
        </div>
    );
}