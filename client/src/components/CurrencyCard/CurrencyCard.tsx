import { memo, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import styles from "./CurrencyCard.module.css";
import Typography from "@mui/material/Typography/Typography";

import { useCurrenciesList } from "../../contexts/currencies";
import currenciesSignsDictionary from "../../dictionaries/currenciesSigns";

const CurrencyCardHeader = memo(({ item }: { item: string }) => {
  return (
    <Typography variant="h6" component="h6">
      {item} ({currenciesSignsDictionary[item]})
    </Typography>
  );
});

const CurrencyCard = ({ item }: { item: string }) => {
  const {
    state: { costs },
  } = useCurrenciesList();

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
