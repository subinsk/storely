import numeral from "numeral";

// ----------------------------------------------------------------------

numeral.register("locale", "en-in", {
  delimiters: {
    thousands: ",",
    decimal: ".",
  },
  abbreviations: {
    thousand: "K",
    million: "M",
    billion: "B",
    trillion: "T",
  },
  ordinal: function (number) {
    return number === 1 ? "st" : "th";
  },
  currency: {
    symbol: "₹",
  },
});

export function fNumber(number: number): string {
  return numeral(number).format();
}

export function fCurrency(number: number): string {
  // Use the custom locale for Indian Rupees
  numeral.locale("en-in");
  const format = number ? numeral(number).format("$0,0.00") : "";

  // Switch back to default locale if needed
  numeral.locale("en");

  return result(format, ".00");
}

export function fPercent(number: number): string {
  const format = number ? numeral(Number(number) / 100).format("0.0%") : "";

  return result(format, ".0");
}

export function fShortenNumber(number: number): string {
  const format = number ? numeral(number).format("0.00a") : "";

  return result(format, ".00");
}

export function fData(number: number): string {
  const format = number ? numeral(number).format("0.0 b") : "";

  return result(format, ".0");
}

function result(format: string, key = ".00") {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, "") : format;
}
