export interface Category {
  id: string;
  name: string;
}

export function isCategory(val: any): val is Category {
  return typeof val === "object" && typeof val.name === "string";
}
