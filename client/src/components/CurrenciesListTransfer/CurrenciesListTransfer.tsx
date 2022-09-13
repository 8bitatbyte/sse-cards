import { useState, useEffect, useCallback, useMemo } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { not, intersection, union, numberOfChecked } from "../../utils";

import { useCurrenciesList } from "../../contexts/currencies";

const CustomList = ({
  title,
  items,
  numberOfChecked,
  checked,
  setChecked,
}: {
  title: React.ReactNode;
  items: string[];
  numberOfChecked: number;
  checked: string[];
  setChecked: (data: string[]) => void;
}) => {
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleToggleAll = (items: string[]) => () => {
    if (numberOfChecked === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const memoList = useMemo(() => {
    return items.map((value: string) => {
      const labelId = `transfer-list-all-item-${value}-label`;

      return (
        <ListItem
          key={value}
          role="listitem"
          button
          onClick={handleToggle(value)}
        >
          <ListItemIcon>
            <Checkbox
              checked={checked.indexOf(value) !== -1}
              tabIndex={-1}
              disableRipple
              inputProps={{
                "aria-labelledby": labelId,
              }}
            />
          </ListItemIcon>
          <ListItemText id={labelId} primary={`${value}`} />
        </ListItem>
      );
    });
  }, [items.length, checked]);

  const memoHeader = useMemo(() => {
    return (
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked !== items.length && numberOfChecked !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked}/${items.length} selected`}
      />
    );
  }, [numberOfChecked, items.length, checked]);

  return (
    <Card>
      {memoHeader}
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {memoList}
        <ListItem />
      </List>
    </Card>
  );
};

const CurrenciesListTransfer = () => {
  const {
    state: { listCurrencies, listMonitoring },
    dispatch,
  } = useCurrenciesList();
  const [checked, setChecked] = useState<string[]>([]);
  const [listening, setListening] = useState(false);

  const leftChecked = useMemo(() => {
    return intersection(checked, listCurrencies);
  }, [checked, listCurrencies.length]);

  const rightChecked = useMemo(() => {
    return intersection(checked, listMonitoring);
  }, [checked, listMonitoring.length]);

  useEffect(() => {
    if (!listening) {
      const sseSource = new EventSource("http://localhost:3001/monitoring");
      sseSource.onmessage = (message) => {
        const newCurrenciesCosts = JSON.parse(message.data);
        dispatch({ type: "updateCosts", payload: newCurrenciesCosts });
      };
      setListening(true);
    }
  }, [listening]);

  useEffect(() => {
    fetch("http://localhost:3001/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listMonitoring),
    });
  }, [listMonitoring]);

  const handleChecked = (eventName: string) => {
    if (eventName === "right") {
      dispatch({ type: "removeFromListMonitoring", payload: checked });
      setChecked(not(checked, leftChecked));
    } else {
      dispatch({ type: "setToListMonitoring", payload: checked });
      setChecked(not(checked, rightChecked));
    }
  };

  const memoButtons = useMemo(() => {
    return (
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={() => handleChecked("right")}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={() => handleChecked("left")}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
    );
  }, [leftChecked.length, rightChecked.length]);

  const handleSetChecked = useCallback((data: string[]) => {
    setChecked(data);
  }, []);

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>
        <CustomList
          title="Лист валют"
          items={listCurrencies}
          numberOfChecked={numberOfChecked(listCurrencies, checked)}
          checked={checked}
          setChecked={handleSetChecked}
        />
      </Grid>
      {memoButtons}
      <Grid item>
        <CustomList
          title="Мониторинг"
          items={listMonitoring}
          numberOfChecked={numberOfChecked(listMonitoring, checked)}
          checked={checked}
          setChecked={handleSetChecked}
        />
      </Grid>
    </Grid>
  );
};

export default CurrenciesListTransfer;
