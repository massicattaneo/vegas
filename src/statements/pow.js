export default function add(a, b) {
    const value = Math.pow(a, b);
    if (isNaN(value)) return Promise.reject(`ERROR POWERING: ${a} ${b}`);
    return Promise.resolve(value);
}
