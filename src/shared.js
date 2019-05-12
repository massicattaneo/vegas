export function calculate(value) {
    return value * 2;
}

export function currency(value, symbol) {
    return `${Number(value).toFixed(2)}${symbol || '€'}`;
}

export function string(value, type) {
    return value.toString()[type]();
}
