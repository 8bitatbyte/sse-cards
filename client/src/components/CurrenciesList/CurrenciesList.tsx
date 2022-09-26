import { useState, useEffect, useMemo } from 'react';
import Grid from "@mui/material/Grid";
import { CurrencyCard } from "../CurrencyCard";

import { store } from '../../store/store';

const useStore = () => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);
  return state;
}

const CurrenciesList = () => {
  const { listMonitoring } = useStore();

  const renderCardList = useMemo(() => {
    if (listMonitoring.length) {
      return listMonitoring.map((item: string, index: number) => {
        return <CurrencyCard key={index} item={item} />;
      });
    } else {
      return <span>Not Monitoring</span>;
    }
  }, [listMonitoring.length]);

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
        {renderCardList}
      </Grid>
    </Grid>
  );
};

export default CurrenciesList;
