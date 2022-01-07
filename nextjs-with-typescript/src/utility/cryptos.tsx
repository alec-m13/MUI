import AvalancheIcon from "../icons/avalanche.svg";
import EthereumIcon from "../icons/ethereum.svg";
import PolygonIcon from "../icons/polygon.svg";

const acronyms = {
    Avalanche: "AVAX",
    Ethereum: "ETH",
    Polygon: "MATIC",
}

const icons = {
    Avalanche: AvalancheIcon,
    Ethereum: EthereumIcon,
    Polygon: PolygonIcon,
}

function invert(obj: any) {
    let returner: any = {};
    for (let prop in obj) returner[obj[prop]] = prop;
    return returner;
}

const fullNames = invert(acronyms);

function fetch(prop: string, obj: any): string {
    return (prop in obj)? obj[prop]: prop;
}

export function acronym(fullName: string): string {
    return fetch(fullName, acronyms);
}

export function fullName(acronym: string): string {
    return fetch(acronym, fullNames);
}

export const allNames = [
    "Ethereum",
    "Polygon",
    "Avalanche",
]

export const allCryptos = allNames.map(x => acronym(x));

export function iconSrc(name: string): string {
    if (name in icons) return icons[name].src;
    name = fullName(name); // if name is actually an acronym
    if (name in icons) return icons[name].src;
    return "not found";
}