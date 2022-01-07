import AVAXIcon from "../icons/avalanche.svg";
import ETHIcon from "../icons/ethereum.svg";
import MATICIcon from "../icons/polygon.svg";

export const srcs = {
    avax: AVAXIcon.src,
    eth: ETHIcon.src,
    matic: MATICIcon.src
}

// for defining cryptos as per CoinGecko API
export interface CryptoD {
    id: string,
    symbol: string,
    name: string
}

export const defaultCryptos: CryptoD[] = [
    {
        id: "avalanche-2",
        symbol: "AVAX",
        name: "Avalanche"
    }/*, {
        id: "binance-peg-avalanche",
        symbol: "avax",
        name: "Binance-Peg Avalanche"
    }*/, {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum"
    }, {
        id: "matic-network",
        symbol: "matic",
        name: "Polygon"
    }
]

// extra data which can be computed from CryptoD data
export interface Crypto extends CryptoD {
    iconSrc: string;
    rates: any
}

export function iconFilter(callback: (x: CryptoD) => any, crypto: CryptoD) {
    if (crypto.symbol.toLowerCase() in srcs) callback(crypto);
}

// defining all cryptos and their data
export const cryptos: Crypto[] = [];

export function getCryptos(callback: () => any, filter = iconFilter) {
    let reqURL = 'https://api.coingecko.com/api/v3/coins/list';
    let req = new XMLHttpRequest();
    req.open('GET', reqURL);
    req.responseType = 'json';
    req.onload = req.onerror = function() {
        let raw = req.response as CryptoD[];
        if (!raw || !raw.length) raw = defaultCryptos;
        for (let crypto of raw) filter(handle, crypto);
        function handle(crypto: CryptoD) {
            // crypto has been filtered and determined keepable so keep it
            let src = (srcs as any)[crypto.symbol.toLowerCase()]; // weird way (to get ts to shut up) to read srcs object
            cryptos.push(Object.assign(
                {
                    iconSrc: src,
                    rates: {}
                }, 
                crypto
            ));
        }
        let conflictProps = new Set<string>();
        for (let crypto of cryptos) for (let propS in crypto) {
            prop = propS as keyof Crypto;
            if (!props.has(propS)) props.set(propS, new Map<string, Crypto>()); // stashes all values for this property
            if (props.get(propS)?.has(crypto[prop].toString()))
                conflictProps.add(propS); // two cryptos have the same value for this prop
            props.get(propS)?.set(crypto[prop].toString(), crypto);
        }
        for (let prop of Array.from(props.keys())) if (!conflictProps.has(prop)) keys.set(prop, props.get(prop)
            || new Map()); // new map is only here to get the compiler to shut up
        getMarkets(callback);
    }
    req.send();
}

export const rates: Map<string, number> = new Map();

function getMarkets(callback: () => any) {
    let reqURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
    cryptos.map(crypto => crypto.id).join("%2C") +
    "&order=market_cap_desc&per_page=" +
    Math.min(250, cryptos.length) +
    "&page=1&sparkline=false";
    let req = new XMLHttpRequest();
    req.open("GET", reqURL);
    req.responseType = "json";
    req.onload  = function() {
        for (let entry of req.response) rates.set(entry.id, entry.current_price);
        callback();
    }
    req.onerror = callback;
    req.send();
}

// find any properties which can be used to identify cryptos (name, fullName, etc) and set up maps for them
let props = new Map<string, Map<string, Crypto>>();
let prop: keyof Crypto;
let keys = new Map<string, Map<String, Crypto>>();

export function getCrypto(keyType: string, key: string): Crypto {
    return keys.get(keyType)?.get(key) || cryptos[0]; // default to first crypto
}

export function getDatum(keyType: string, key: string, propName: keyof Crypto) {
    let crypto = getCrypto(keyType, key);
    if (crypto) return crypto[propName];
}
