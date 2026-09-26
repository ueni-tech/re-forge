// 001-sku-search — solution
//
// テストが import するのは findSku だけ。型・内部関数・命名は自由。
// 境界の形は 01.md を参照。
type SkuQuery = { color: string; diameter: number; row: string };
type InventoryItem = { sku: string; color: string; diameter: number; row: string; stock?: number };
type SkuSearchResult =
  | { status: "exact"; sku: string }
  | { status: "suggestions"; candidates: string[] }
  | { status: "invalid" };

export function findSku(query: SkuQuery, inventory: InventoryItem[]): SkuSearchResult {
  if (!isKnownColorAndRow(query, inventory)) return { status: "invalid" };

  const exact = findExact(query, inventory);
  if (exact) return { status: "exact", sku: exact.sku };

  const candidates = searchCandidates(query, inventory);
  return { status: "suggestions", candidates: candidates.map((record) => record.sku) };
}

function isKnownColorAndRow(query: SkuQuery, inventory: InventoryItem[]): boolean {
  const hitColor = inventory.some((record) => query.color === record.color);
  if (!hitColor) return false;
  const hitRow = inventory.some((record) => query.row === record.row);
  if (!hitRow) return false;
  return true;
}

function isAvailable(record: InventoryItem) {
  if (!record) return false;
  return record.stock === undefined || record.stock > 0;
}

function findExact(query: SkuQuery, inventory: InventoryItem[]): InventoryItem | undefined {
  const exact = inventory.find(
    (record) =>
      record.color === query.color &&
      record.diameter === query.diameter &&
      record.row === query.row,
  );
  if (!exact) return undefined;

  return isAvailable(exact) ? exact : undefined;
}

function searchCandidates(query: SkuQuery, inventory: InventoryItem[]): InventoryItem[] {
  const candidatesRecords: InventoryItem[] = [];

  inventory.forEach((record) => {
    if (record.color !== query.color) return;
    if (record.row !== query.row) return;
    if (!isAvailable(record)) return;
    candidatesRecords.push(record);
  });

  candidatesRecords.sort((a, b) => {
    return compareByProximity(query, a, b);
  });

  return candidatesRecords.slice(0, 3);
}

function compareByProximity(query: SkuQuery, a: InventoryItem, b: InventoryItem): number {
  if (Math.abs(query.diameter - a.diameter) < Math.abs(query.diameter - b.diameter)) return -1;
  if (Math.abs(query.diameter - a.diameter) > Math.abs(query.diameter - b.diameter)) return 1;
  if (a.diameter < b.diameter) return -1;
  if (a.diameter > b.diameter) return 1;
  return 0;
}
