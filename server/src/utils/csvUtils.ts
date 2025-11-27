export function escapeCsvField(field: string | number | null | undefined): string {
    const value = field?.toString() || ''
    // If field contains comma, quote, newline, or carriage return, wrap in quotes and escape existing quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
        return `"${value.replace(/"/g, '""')}"`
    }
    return value
}
