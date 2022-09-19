import styles from "./App.module.css";
import { CurrenciesListProvider } from "./contexts/currencies";
import { CurrenciesListTransfer } from "./components/CurrenciesListTransfer/";
import { CurrenciesList } from "./components/CurrenciesList";

const App = () => {
  return (
    <div className={styles.App}>
      <CurrenciesListProvider>
        <CurrenciesListTransfer />
        <CurrenciesList />
      </CurrenciesListProvider>
    </div>
  );
};

export default App;
