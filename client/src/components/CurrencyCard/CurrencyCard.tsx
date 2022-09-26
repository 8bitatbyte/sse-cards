import { memo, useMemo, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import styles from "./CurrencyCard.module.css";
import Typography from "@mui/material/Typography/Typography";

import currenciesSignsDictionary from "../../dictionaries/currenciesSigns";

import { store } from '../../store/store';

const useStore = () => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);
  return state;
}

const CurrencyCardHeader = memo(({ item }: { item: string }) => {
  return (
    <Typography variant="h6" component="h6">
      {item} ({currenciesSignsDictionary[item]})
    </Typography>
  );
});

const CurrencyCard = ({ item }: { item: string }) => {
  const { costs } = useStore();

  const name = useMemo(() => item.toUpperCase().trim(), [item]);

  return (
    <Grid item>
      <Card className={styles.currencyCard}>
        <CurrencyCardHeader item={item} />
        <Typography variant="h3" component="h3">
          {costs[name] ?? "Undefined"}
        </Typography>
      </Card>
    </Grid>
  );
};

export default CurrencyCard;
