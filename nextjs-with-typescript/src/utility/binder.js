export function bind(thisObj, functionName) {
    if (typeof thisObj[functionName] !== "function") throw Error("cannot bind a nonfunction");
    thisObj[functionName] = thisObj[functionName].bind(thisObj);
}