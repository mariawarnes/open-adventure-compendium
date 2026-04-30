export function toTitleCase(str?: string | null) {
  if (!str) {
    return "";
  }

  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}

export function getDomainLabel(url?: string | null): string | null {
  if (!url) {
    return null;
  }

  let hostname: string;

  try {
    hostname = new URL(url).hostname;
  } catch {
    return null; // invalid URL
  }

  const parts: string[] = hostname.split(".");

  if (parts.length < 2) return null;

  const isMultiPartTLD = parts.length >= 3 && parts.at(-2)!.length <= 3;

  return isMultiPartTLD ? parts.at(-3)! : parts.at(-2)!;
}
