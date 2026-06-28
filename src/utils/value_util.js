export function FormatRupiahWithRp(value) {
    if (!value) return "0"

    return "Rp " + value.toLocaleString("id-ID")
}

export function FormatRupiah(value) {
    if (!value) return "0"

    return Number(value).toLocaleString("id-ID");
}

export function SanitizeNumber(value) {
  let result = value.replace(/\D/g, "");

  result = result.replace(/^0+/, "");

  return result;
}