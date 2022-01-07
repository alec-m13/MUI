import { bind } from "./binder";

export class PropertySwapper {
    static space = /^ /;

    constructor(firstWord, secondWord) {
        this.firstWord = firstWord;
        this.secondWord = secondWord;
        this.first = RegExp("^" + firstWord + "(?![a-z])");
        this.second = RegExp("^" + secondWord + "(?![a-z])");
        bind(this, "swapWord");
        bind(this, "swap");
    }

    swapWord(word) {
        return word.replace(this.first, " ").replace(this.second, this.firstWord).replace(PropertySwapper.space, this.secondWord);
    }

    swap(obj) {
        let newObj = {}, swapWord = this.swapWord;
        for (let prop in obj) newObj[swapWord(prop)] = obj[prop];
        return newObj;
    }
}