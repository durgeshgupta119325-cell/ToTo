
/**
 * Geospatial Utility Library for TOTO Matching Engine.
 * Implements grid-based partitioning and scoring logic.
 */

// Resolution for spatial partitioning (approx 1km cells)
const GRID_RESOLUTION = 0.01;

/**
 * Converts GPS coordinates into a Grid Cell ID (S2/H3 Style).
 */
export function getGeoCell(lat: number, lng: number): string {
  const x = Math.floor(lat / GRID_RESOLUTION);
  const y = Math.floor(lng / GRID_RESOLUTION);
  return `cell_${x}_${y}`;
}

/**
 * Gets neighboring cells for a given coordinate to expand search radius.
 */
export function getNearbyCells(lat: number, lng: number, radius = 1): string[] {
  const cells: string[] = [];
  const xBase = Math.floor(lat / GRID_RESOLUTION);
  const yBase = Math.floor(lng / GRID_RESOLUTION);

  for (let x = xBase - radius; x <= xBase + radius; x++) {
    for (let y = yBase - radius; y <= yBase + radius; y++) {
      cells.push(`cell_${x}_${y}`);
    }
  }
  return cells;
}

/**
 * Calculates straight-line distance between two points in KM.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Weighted Scoring Engine for Partner Selection.
 * Score = (50% Distance) + (30% Rating) + (20% Availability Bonus)
 */
export function calculateMatchingScore(params: {
  distance: number;
  rating: number;
  isAvailable: boolean;
}): number {
  const distanceScore = Math.max(0, 1 - params.distance / 5); // Better score if < 5km
  const ratingScore = params.rating / 5;
  const availabilityScore = params.isAvailable ? 1 : 0;

  return (distanceScore * 0.5) + (ratingScore * 0.3) + (availabilityScore * 0.2);
}
