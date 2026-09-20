export const haversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

export const normalizeDistanceScore = (distanceKm: number, maxDistanceKm = 50): number => {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    return 0;
  }

  if (distanceKm === 0) {
    return 1;
  }

  const normalized = 1 - Math.min(distanceKm / maxDistanceKm, 1);
  return Number(Math.max(0, Math.min(normalized, 1)).toFixed(6));
};
