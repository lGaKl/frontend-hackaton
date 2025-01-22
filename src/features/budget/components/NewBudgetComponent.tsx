import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import "./NewBudgetComponent.css";
import { BudgetCreateCommand } from "../services/commands/BudgetCreateCommand.ts";

interface NewBudgetComponentProps {
    onBudgetCreated: (b: BudgetCreateCommand) => void;
}

export function NewBudgetComponent({ onBudgetCreated }: NewBudgetComponentProps) {
    const navigate = useNavigate();
    const [inputBudget, setInputBudget] = useState({ total: 0, date: '' });

    const handleSubmit = (e: FormEvent<HTMLElement>) => {
        e.preventDefault();

        const newBudget = {
            total: inputBudget.total,
            date_budget: new Date(inputBudget.date + "-01").toISOString().split('T')[0]
        };
        console.log("Budget to be submitted:", newBudget);
        onBudgetCreated(newBudget);
        navigate("/budget");

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
                <button type="submit">Save Budget</button>
                <button type="button" onClick={handleBackClick} className="back-button">Back</button>
            </form>
        </div>
    );
}