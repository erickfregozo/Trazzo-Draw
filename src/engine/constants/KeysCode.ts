export const keyCodes: Record<string, string> = {
    " ": "Space",
    "Delete": "Supr",
}

export const getKeyCode = (key: string): string => keyCodes[key] ?? key;