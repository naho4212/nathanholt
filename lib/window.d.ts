declare global {
  interface Window {
    __nhPrefill?: (prompt: string) => void;
  }
}

export {};
