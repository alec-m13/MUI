import React from "react";
import { iconSrc } from "../utility/cryptos";


export class CryptoIcon extends React.Component<{name: string}, any> {
    render() {
        return<img src={iconSrc(this.props.name)}/>;
    }
}