export function generateHash(length) {
    let hash = '';
    while (hash.length < length) {
        hash += Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0');
    }
    return hash.slice(0, length);
}