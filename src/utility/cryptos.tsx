// crypto icons
import AVAXIcon from "../icons/avalanche.svg";
import ETHIcon from "../icons/ethereum.svg";
import MaticIcon from "../icons/polygon.svg";

// for defining cryptos
interface CryptoD {
    name: string;
    fullName: string;
    icon: {src: string};
}

interface Crypto extends CryptoD {
    index: number;
    iconSrc: string;
}

// defining all cryptos and their data
const cryptoDefs: CryptoD[] = [
    {
        name: "ETH",
        fullName: "Ethereum",
        icon: ETHIcon
    }, {
        name: "Matic",
        fullName: "Polygon",
        icon: MaticIcon
    }, {
        name: "AVAX",
        fullName: "Avalanche",
        icon: AVAXIcon
    }
]

// extending crypto format
export const cryptos: Crypto[] = [];
for (let i = 0; i < cryptoDefs.length; ++i) cryptos[i] = Object.assign(
    {
        index: i,
        iconSrc: cryptoDefs[i].icon.src
    },
    cryptoDefs[i]
)

// find any properties which can be used to identify cryptos (name, fullName, etc) and set up maps for them
let props = new Map<string, Map<string, Crypto>>(), conflictProps = new Set<string>();
let prop: keyof Crypto;
for (let crypto of cryptos) for (let propS in crypto) {
    prop = propS as keyof Crypto;
    if (!props.has(propS)) props.set(propS, new Map<string, Crypto>()); // stashes all values for this property
    if (props.get(propS)?.has(crypto[prop].toString()))
        conflictProps.add(propS); // two cryptos have the same value for this prop
    props.get(propS)?.set(crypto[prop].toString(), crypto);
}
let keys = new Map<string, Map<String, Crypto>>();
for (let prop of Array.from(props.keys())) if (!conflictProps.has(prop)) keys.set(prop, props.get(prop)
|| new Map()); // new map is only here to get the compiler to shut up
export function getCrypto(keyType: string, key: string): Crypto {
    return keys.get(keyType)?.get(key) || cryptos[0]; // default to first crypto
}

export function getDatum(keyType: string, key: string, propName: keyof Crypto) {
    return getCrypto(keyType, key)[propName];
}