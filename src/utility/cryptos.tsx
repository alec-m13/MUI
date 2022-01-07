import AVAXIcon from "../icons/avalanche.svg";
import ETHIcon from "../icons/ethereum.svg";
import MATICIcon from "../icons/polygon.svg";

export const srcs = {
    AVAX: AVAXIcon.src,
    ETH: ETHIcon.src,
    MATIC: MATICIcon.src
}

// for defining cryptos as per CoinGecko API
interface CryptoD {
    id: string,
    symbol: string,
    name: string
}

// extra data which can be computed from CryptoD data
export interface Crypto extends CryptoD {
    iconSrc: string;
}

export function iconFilter(callback: (x: CryptoD) => any, crypto: CryptoD) {
    if (crypto.symbol.toUpperCase() in srcs) {
        crypto.symbol = crypto.symbol.toUpperCase();
        callback(crypto);
    }
}

// defining all cryptos and their data
export const cryptos: Crypto[] = [];

export function getCryptos(callback: () => any, filter = iconFilter) {
    var requestURL = 'https://api.coingecko.com/api/v3/coins/list';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        let raw = request.response as CryptoD[];
        /*raw = [
            {
                id: "no",
                symbol: "no",
                name: "no"
            }, {
                id: "eth",
                symbol: "eth",
                name: "ethereum"
            }
        ];*/
        for (let crypto of raw) filter(handle, crypto);
        function handle(crypto: CryptoD) {
            // crypto has been filtered and determined keepable so keep it
            let src = (srcs as any)[crypto.symbol]; // to get typescript to shut up
            cryptos.push(Object.assign(
                {
                    iconSrc: src
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
        callback();
    }
}

// find any properties which can be used to identify cryptos (name, fullName, etc) and set up maps for them
let props = new Map<string, Map<string, Crypto>>();
let prop: keyof Crypto;
let keys = new Map<string, Map<String, Crypto>>();

export function getCrypto(keyType: string, key: string): Crypto {
    return keys.get(keyType)?.get(key) || cryptos[0]; // default to first crypto
}

export function getDatum(keyType: string, key: string, propName: keyof Crypto) {
    return getCrypto(keyType, key)[propName];
}
