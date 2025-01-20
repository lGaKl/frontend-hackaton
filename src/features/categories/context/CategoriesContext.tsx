import {Category} from "../types/category.ts";
import {createContext, ReactNode, useContext, useEffect, useReducer} from "react";

export interface Action {
    type: string
    category: Category
}

const CategoryContext = createContext<Category[]>([]);
const CategoryDispatchContext = createContext<(action: Action) => void>(null!!);

function reducer(categories: Category[], action: Action) {
    switch (action.type) {
        case "add":
            return[...categories, action.category];
        case "update":
            return categories.map(category => category.id === action.category.id ? action.category : category);
        case "delete":
            return categories.filter(category => category.id !== action.category.id);
        default:
            throw Error("Unknown action type: " + action.type);
    }
}

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [categories, dispatch] = useReducer(reducer, [
        { id: 1, nameCategory: "Alimentation", maxBudget: 200 },
        { id: 2, nameCategory: "Transport", maxBudget: 100 },
        { id: 3, nameCategory: "Loisirs", maxBudget: 150 },
    ]);

    useEffect(() => {
        const getData = async () => {
            /*const categories = await fetchCategories();
            categories.forEach(category => dispatch({type: "add", category: category}));*/
        }
        getData();
    }, []);

    return <>
        <CategoryContext.Provider value={categories}>
            <CategoryDispatchContext.Provider value={dispatch}>
                {children}
            </CategoryDispatchContext.Provider>
        </CategoryContext.Provider>
    </>
}

export const useCategories = () => useContext(CategoryContext);
export const useCategoryDispatch = () => useContext(CategoryDispatchContext);