import Grid from "@mui/material/Grid";
import { CurrencyCard } from "../CurrencyCard";

import { useCurrenciesList } from "../../contexts/currencies";

const CurrencyList = () => {
  const { state } = useCurrenciesList();

  const renderCardList = () => {
    if (state.listMonitoring.length) {
      return state.listMonitoring.map((item: string, index: number) => {
        return <CurrencyCard key={index} item={item} />;
      });
    } else {
      return <span>Not Monitoring</span>;
    }
  };

  return (
    <Grid
      sx={{ mt: "2rem" }}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={3}
        width="45vw"
      >
        {renderCardList()}
      </Grid>
    </Grid>
  );
};

export default CurrencyList;
