/*
Centraliser des fonctions utiles pour éviter la redondance.
 */
export const debounce = (func: Function, delay: number) => {
    let debounceTimer: number;
    return function () {
        // @ts-expect-error
        const context: any = this;
        const args: any = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}