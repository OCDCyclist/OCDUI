export function isStringInteger(str: string) {
    if( typeof(str) !== 'string') return false;
    const num = Number(str.trim());
    return Number.isInteger(num);
}

export function isStringNumber(str: string) {
    if( typeof(str) !== 'string') return false;
    const trimStr = str.trim();
    return trimStr !== "" && !isNaN(Number(trimStr));
}

export function isBooleanString(str: string) {
    if( typeof(str) !== 'string') return false;
    return str === '1' || str === '0';
}