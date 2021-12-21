export const parseAmountMultiplier = (value: string): number => {
    switch (value.toUpperCase()) {
        case 'K':
            return 1_000;
        case 'M':
            return 1_000_000;
        case 'B':
            return 1_000_000_000;
        default:
            return 1;
    }
}

export const parseAmount = (value: string): number => {
    if (!value) {
        return 0;
    }

    const regexMatch = value.match(/([0-9\\.]+)([KMB])/);
    if (!regexMatch) {
        return Number(value);
    }

    const number = Number(regexMatch[1]);
    const multiplier = parseAmountMultiplier(regexMatch[2]);

    return number * multiplier;
}