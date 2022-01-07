const rates = {};

const loopTime = 60000;

function fetch(callback) {
    var requestURL = 'https://api.coingecko.com/api/v3/exchange_rates';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        Object.assign(rates, request.response.rates);
        console.log(rates);
        if (callback) callback(rates);
        window.setTimeout(() => fetch(callback), loopTime);
    }
}

export function setup() {
    fetch();
}

export function getRate(from, to) {
    if (from in rates && to in rates) return rates[to]/rates[from];
    return NaN;
}