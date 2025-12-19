/**
 * Group orders by city + country
 */
export function groupOrdersByCity(shipments = []) {
  const cityMap = {};

  shipments.forEach((s) => {
    console.log(s);
    
    const city = s.ship_to?.city_locality;
    const country = s.ship_to?.country_code;

    if (!city || !country) return;

    const key = `${city}, ${country}`;

    if (!cityMap[key]) {
      cityMap[key] = {
        city,
        country,
        orders: 0
      };
    }

    cityMap[key].orders += 1;
  });

  // Convert to array & sort by orders
  return Object.values(cityMap).sort((a, b) => b.orders - a.orders);
}

/**
 * Get best city for next warehouse
 * (currently highest order concentration)
 */
export function getBestLocation(cities = []) {
  if (!cities.length) return null;
  return cities[0];
}

/**
 * Haversine distance (km) calculation
 */
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Coverage % of orders within radius (km)
 */
export function calculateCoverage(cities = [], centerCoords, radiusKm = 250) {
  if (!centerCoords) return 0;

  let covered = 0;
  let total = cities.reduce((a, b) => a + b.orders, 0);

  cities.forEach((c) => {
    if (!c.lat || !c.lng) return;

    const distance = getDistanceKm(
      centerCoords.lat,
      centerCoords.lng,
      c.lat,
      c.lng
    );

    if (distance <= radiusKm) {
      covered += c.orders;
    }
  });

  return total === 0 ? 0 : Math.round((covered / total) * 100);
}

/**
 * Calculate improvement if a new location is added
 */
export function calculateImprovement(
  cities,
  currentCenter,
  proposedCenter,
  radius = 250
) {
  const currentCoverage = calculateCoverage(
    cities,
    currentCenter,
    radius
  );

  const newCoverage = calculateCoverage(
    cities,
    proposedCenter,
    radius
  );

  return {
    currentCoverage,
    newCoverage,
    difference: newCoverage - currentCoverage
  };
}

/**
 * OPTIONAL: Estimate shipping cost reduction
 * (Very rough simulation)
 */
export function estimateSavings(
  cities,
  currentCenter,
  proposedCenter,
  costPerKm = 0.5
) {
  let currentCost = 0;
  let newCost = 0;

  cities.forEach((c) => {
    if (!c.lat || !c.lng) return;

    const curDist = getDistanceKm(
      currentCenter.lat,
      currentCenter.lng,
      c.lat,
      c.lng
    );

    const newDist = getDistanceKm(
      proposedCenter.lat,
      proposedCenter.lng,
      c.lat,
      c.lng
    );

    currentCost += curDist * c.orders * costPerKm;
    newCost += newDist * c.orders * costPerKm;
  });

  return {
    currentCost: Math.round(currentCost),
    newCost: Math.round(newCost),
    savings: Math.round(currentCost - newCost)
  };
}
