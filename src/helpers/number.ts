export function numberWithSeparator(x: number, separator = ','): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function nFormatter(num: number, digits = 2): string {

    if (num < 0) return num.toString();

    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

    const item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });

    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}
