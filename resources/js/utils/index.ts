export const toRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
};
export const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
        maximumFractionDigits: 0,
    }).format(value);
};
export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then((elm) => {
        console.log(elm);
    });
};
