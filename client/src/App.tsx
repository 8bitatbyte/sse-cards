import styles from "./App.module.css";
import { CurrenciesListProvider } from "./contexts/currencies";
import { CurrenciesListTransfer } from "./components/CurrenciesListTransfer/";

const App = () => {
  return (
    <div className={styles.App}>
      <CurrenciesListProvider>
        <CurrenciesListTransfer />
      </CurrenciesListProvider>
    </div>
  );
};

export default App;
