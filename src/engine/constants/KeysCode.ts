export const keyCodes: Record<string, string> = {
    " ": "Space",
}

export const getKeyCode = (key: string): string => keyCodes[key] ?? key;