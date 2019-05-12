export default function blocking(x) {
    let i = 0;
    while (i < x) {
        i++;
    }
    return Promise.resolve(i);
}
