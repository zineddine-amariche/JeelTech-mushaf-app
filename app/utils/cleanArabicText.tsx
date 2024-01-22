export const cleanArabicText = (text: string): string => {
    return text
      .trim()
      .replace(/[^\u0600-\u06FF\s]/g, "")
      .replace(/\s+/g, " ");
  }