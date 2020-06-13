const britishFormat = new Intl.NumberFormat(
    'en-GB',
    {
        style: 'currency',
        currency: 'GBP',
    }
);

export default function (number) {
    return britishFormat.format(number);
}
