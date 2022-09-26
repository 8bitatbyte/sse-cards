import styles from "./App.module.css";
import { CurrenciesListTransfer } from "./components/CurrenciesListTransfer/";
import { CurrenciesList } from "./components/CurrenciesList";

const App = () => {
  return (
    <div className={styles.App}>
        <CurrenciesListTransfer />
        <CurrenciesList />
    </div>
  );
};

export default App;
