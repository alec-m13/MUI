import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { cryptos, getCrypto, getDatum } from "../utility/cryptos";

export function CryptoSelect(props: {label: string, show?: string, disable?: string, onChange: (crypto: string) => any}) {
  //const [crypto, setCrypto] = React.useState(props.show || "");

  const handleChange = (event: any) => {
    //setCrypto(event.target.value);
    props.onChange(event.target.value);
  };

  function makeOption(name: string) {
    return <MenuItem
        value={name}
        key={name}
        disabled={name === props.disable}
    >
        <img src={getDatum("name", name, "iconSrc") as string}/>
        <span>{name}</span>
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
          {cryptos.map(crypto => makeOption(crypto.name))}
        </Select>
      </FormControl>
    </Box>
  );
}
