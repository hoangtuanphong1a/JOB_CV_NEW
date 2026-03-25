export function toPascalCase(str: string): string {
    return str
        .replace(/[-_\s]+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}