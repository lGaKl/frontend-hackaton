import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import "./NewBudgetComponent.css";
import { BudgetCreateCommand } from "../services/commands/BudgetCreateCommand.ts";

interface NewBudgetComponentProps {
    onBudgetCreated: (b: BudgetCreateCommand) => void;
}

export default function NewBudgetComponent({ onBudgetCreated }: NewBudgetComponentProps) {
    const navigate = useNavigate();
    //const [inputBudget, setInputBudget] = useState({ total: 0, date: '' });
    const [inputTotal, setInputTotal] = useState({total: 0});
    const [inputDate, setInputDate] = useState({date: ''});

    function handleSubmit (e: FormEvent<HTMLElement>) {
        e.preventDefault();

        const newBudget = {
            total: inputTotal.total,
            dateBudget: new Date(inputDate.date + "-01").toISOString().split('T')[0],
            userId: Number(localStorage.getItem("userId"))
        };
        console.log("Budget to be submitted:", newBudget);
        onBudgetCreated(newBudget);
        navigate("/budget/manager");

        const form = e.target as HTMLFormElement;
        form.reset();
    }

    const handleBackClick = () => {
        navigate("/budget/manager");
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
                        value={inputTotal.total}
                        onChange={(e) => setInputTotal({ ...inputTotal, total: parseFloat(e.target.value) })}
                        required
                    />
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="month"
                        value={inputDate.date}
                        onChange={(e) => setInputDate({ ...inputDate, date: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Save Budget</button>
                <button type="button" onClick={handleBackClick} className="back-button">Back</button>
            </form>
        </div>
    );
}