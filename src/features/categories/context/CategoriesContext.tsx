import {Category} from "../types/category.ts";
import {createContext, ReactNode, useContext, useEffect, useReducer} from "react";
import {fetchCategories} from "../services/category-service.tsx";

export interface Action {
    type: string
    category: Category
}

const CategoryContext = createContext<Category[]>([]);
const CategoryDispatchContext = createContext<(action: Action) => void>(null!!);

function reducer(categories: Category[], action: Action) {
    switch (action.type) {
        case "add":
            if (categories.some(cat => cat.id === action.category.id)) {
                return categories;
            }
            return [...categories, action.category];
        case "update":
            return categories.map(category => category.id === action.category.id ? action.category : category);
        case "delete":
            return categories.filter(category => category.id !== action.category.id);
        default:
            throw Error("Unknown action type: " + action.type);
    }
}

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [categories, dispatch] = useReducer(reducer, []);

    useEffect(() => {
        let isMounted = true;
        const getData = async () => {
            const fetchedCategories = await fetchCategories();
            if (isMounted) {
                fetchedCategories.forEach(category => {
                    if (!categories.some(cat => cat.id === category.id)) {
                        dispatch({ type: "add", category: category });
                    }
                });
            }
        };
        getData();
        return () => {
            isMounted = false;
        };
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