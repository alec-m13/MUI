import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Crypto, getDatum } from "../utility/cryptos";
import { Tooltip } from '@mui/material';

export function CryptoSelect(props: {
  label: string,
  show?: string,
  disable?: string,
  onChange: (crypto: string) => any,
  cryptos: Crypto[]
}) {
  //const [crypto, setCrypto] = React.useState(props.show || "");

  const handleChange = (event: any) => {
    //setCrypto(event.target.value);
    props.onChange(event.target.value);
  };

  function makeOption(crypto: Crypto) {
    return <MenuItem
        value={crypto.symbol}
        key={crypto.id}
        disabled={crypto.symbol === props.disable}
    >
      <Tooltip title={crypto.name} placement="left">
        <div>
          <img src={getDatum("id", crypto.id, "iconSrc") as string}/>
          <span>{crypto.symbol}</span>
        </div>
      </Tooltip>
    </MenuItem>
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="crypto-select-label">{props.label}</InputLabel>
        <Select
          labelId="crypto-select-label"
          id="crypto-select"
          value={props.show || ""}
          label={props.label}
          onChange={handleChange}
        >
          {props.cryptos.map(crypto => makeOption(crypto))}
        </Select>
      </FormControl>
    </Box>
  );
}
