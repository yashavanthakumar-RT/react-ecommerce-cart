export function formatINR(value) {
    if (value == null) return "₹0.00";
    const num = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(num)) return "₹0.00";
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(num);
}
