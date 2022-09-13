import styles from "./App.module.css";
import { CurrenciesListProvider } from "./contexts/currencies";

const App = () => {
  return (
    <div className={styles.App}>
      <CurrenciesListProvider>
        <h1>Child in provider</h1>
      </CurrenciesListProvider>
    </div>
  );
};

export default App;
