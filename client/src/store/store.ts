function createStore(initialState: any) {
    let currentState = initialState;
    const listeners = new Set();
    return {
        subscribe: (listener: any): any => {
            listeners.add(listener);
            return () => listeners.delete(listener)
        },
        getState: () => currentState,
        setToListMonitoring: (payload: any) => {
            const monitoring = currentState.listMonitoring.concat(payload);
            const currencieslist = currentState.listCurrencies.filter((item: string) => {
                return !monitoring.includes(item)
            });
            const changes = { ...currentState, listCurrencies: currencieslist, listMonitoring: monitoring };
            listeners.forEach((listener: any) => listener(changes));
            currentState = changes;
        },
        removeFromListMonitoring: (payload: any) => {
            const currencieslist = currentState.listCurrencies.concat(payload);
            const monitoring = currentState.listMonitoring.filter((item: string) => {
                return !currencieslist.includes(item)
            });
            const changes = { ...currentState, listCurrencies: currencieslist, listMonitoring: monitoring };
            listeners.forEach((listener: any) => listener(changes));
            currentState = changes;
        },
        updateCosts: (payload: any) => {
            const changes = { ...currentState, costs: payload };
            listeners.forEach((listener: any) => listener(changes));
            currentState = changes;
        }
    }
}

const store = createStore({
    listCurrencies: ["JPY", "EUR"],
    listMonitoring: ["USD"],
    costs: { USD: 1000 },
})

export { store };