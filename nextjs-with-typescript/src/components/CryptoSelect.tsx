import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import ETHIcon from "../icons/ethereum.svg";
import MATICIcon from "../icons/polygon.svg";
import AVAXIcon from "../icons/avalanche.svg";
import { allCryptos } from '../utility/cryptos';

const icons = new Map<string, string>();
icons.set("ETH", ETHIcon.src);
icons.set("MATIC", MATICIcon.src);
icons.set("AVAX", AVAXIcon.src);

export function CryptoSelect(props: {show?: string, disable?: string, onChange: (crypto: string) => any}) {
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
        <img src={icons.get(name)}/>
        <span>{name}</span>
    </MenuItem>
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="crypto-select-label">Select</InputLabel>
        <Select
          labelId="crypto-select-label"
          id="crypto-select"
          value={props.show || ""}
          label="Select"
          onChange={handleChange}
        >
          {allCryptos.map(crypto => makeOption(crypto))}
        </Select>
      </FormControl>
    </Box>
  );
}
