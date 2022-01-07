import React from "react";
import { CryptoIcon } from "./CryptoIcon";
import { acronym } from "../utility/cryptos";

export class CryptoOption extends React.Component<{name: string}, any> {
    render() {
        return <option>
            <CryptoIcon name={this.props.name}/>
            {acronym(this.props.name)}
        </option>
    }
}