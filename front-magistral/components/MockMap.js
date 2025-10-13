import { useMemo, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Polygon, Tooltip, Circle } from 'react-leaflet';
import axios from 'axios';

// Center on Guatemala City (approx)
const CENTER = [14.6349, -90.5069];

// Mock origin/destination and route polyline
const ORIGIN = [14.6090, -90.5269]; // Zona 1 aprox
const DEST = [14.6514, -90.4923];   // Zona 18 aprox

// Mock route approximating calles/avenidas principales (sin ruteo externo)
// Trayecto orientativo: Zona 1 -> Zona 4 -> Calzada La Paz/Atlántico -> Zona 18
const ROUTE_POINTS = [
  ORIGIN,                          // Zona 1 aprox
  [14.6118, -90.5246],             // 6a Av hacia NE
  [14.6142, -90.5215],
  [14.6168, -90.5188],
  [14.6185, -90.5160],             // Paso por zona 4
  [14.6196, -90.5128],
  [14.6210, -90.5101],
  [14.6234, -90.5078],             // Acercando a La Paz
  [14.6262, -90.5054],
  [14.6290, -90.5035],
  [14.6317, -90.5018],
  [14.6346, -90.5000],
  [14.6375, -90.4986],
  [14.6410, -90.4973],             // Borde Atlántico
  [14.6445, -90.4961],
  [14.6479, -90.4948],
  [14.6500, -90.4938],
  DEST                             // Zona 18 aprox
];

// Ruta simulada alternativa que evita el polígono de riesgo y los focos principales
// Toma un desvío más al este antes de subir hacia Zona 18
const ROUTE_POINTS_AVOID = [
  ORIGIN,
  [14.6118, -90.5246],
  [14.6142, -90.5215],
  [14.6168, -90.5188],
  // Desvío al este para evitar polígono de riesgo
  [14.6179, -90.5148],
  [14.6194, -90.5112],
  [14.6212, -90.5079],
  [14.6236, -90.5045],
  // Continúa al NE por zona más despejada
  [14.6268, -90.5019],
  [14.6302, -90.4998],
  [14.6334, -90.4984],
  [14.6366, -90.4972],
  [14.6402, -90.4960],
  [14.6438, -90.4949],
  [14.6471, -90.4937],
  DEST
];

// Colores por nivel (alineado a la leyenda de Home)
const LEVEL_COLORS = {
  'muy-alta': '#ff5f6d',
  'alta': '#ff9966',
  'media': '#ffd56f',
  'baja': '#8bd46e'
};

// Puntos de calor simulados (inspirados en zonas frecuentemente citadas en reportes publicos; uso aproximado y solo con fines de mock)
// Nota: Estos puntos son simulados y no representan un mapa real de riesgo.
const HEAT_POINTS = [
  // Muy alta
  { center: [14.659, -90.486], level: 'muy-alta', label: 'Zona 18 (simulado)' },
  { center: [14.645, -90.574], level: 'muy-alta', label: 'Mixco - Calz. San Juan (simulado)' },

  // Alta
  { center: [14.611, -90.551], level: 'alta', label: 'Nudo El Trebol (simulado)' },
  { center: [14.626, -90.559], level: 'alta', label: 'Calzada Roosevelt (simulado)' },
  { center: [14.634, -90.508], level: 'alta', label: 'Centro/Zona 4-9 (simulado)' },

  // Media
  { center: [14.623, -90.532], level: 'media', label: 'Zona 3 - Mercado (simulado)' },
  { center: [14.613, -90.535], level: 'media', label: 'Zona 1 (simulado)' },
  { center: [14.650, -90.502], level: 'media', label: 'Carretera a Chinautla (simulado)' },

  // Fuera del trayecto central, referenciales
  { center: [14.481, -90.587], level: 'alta', label: 'Villa Nueva - Barcena (simulado)' },

  // Baja (simulados "mas seguros" o menor incidencia relativa)
  { center: [14.603, -90.488], level: 'baja', label: 'Zona 10 - Reforma (simulado)' },
  { center: [14.618, -90.505], level: 'baja', label: 'Zona 9 - Obelisco (simulado)' },
  { center: [14.644, -90.509], level: 'baja', label: 'Zona 15 - Vista Hermosa (simulado)' }
];

const HAZARD_POLYGONS = [
  {
    points: [
      [14.620, -90.530],
      [14.623, -90.523],
      [14.617, -90.518],
      [14.614, -90.525],
    ]
  }
];

// Utility: distance in meters between two [lat,lng]
function haversine(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Point-in-polygon (ray casting). point [lat,lng], polygon [[lat,lng], ...]
function pointInPolygon(point, polygon) {
  const [lat, lng] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = (yi > lng) !== (yj > lng) && lat < ((xj - xi) * (lng - yi)) / ((yj - yi) || 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Compute if any sampled point of segment is inside hazard circles or polygons
function segmentNearHazard(p1, p2, hazardCircles, hazardPolygons) {
  const samples = 12;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const lat = p1[0] + (p2[0] - p1[0]) * t;
    const lng = p1[1] + (p2[1] - p1[1]) * t;
    // Circles
    for (const h of hazardCircles) {
      if (haversine([lat, lng], h.center) <= h.radius) return true;
    }
    // Polygons
    for (const poly of hazardPolygons) {
      if (pointInPolygon([lat, lng], poly)) return true;
    }
  }
  return false;
}

export default function MockMap({ className, showTiles = true, useRouting = true }) {
  const [fetchedRoute, setFetchedRoute] = useState([]); // [ [lat,lng], ... ]
  const [routeError, setRouteError] = useState(null);
  const [avoidHigh, setAvoidHigh] = useState(false); // evitar media/alta/muy-alta
  const [routeSummary, setRouteSummary] = useState({ distanceMeters: null, durationSec: null, source: 'mock', provider: null });

  // Fetch real route from OpenRouteService if enabled and API key available
  // Helpers to build avoid polygons
  const toLngLat = (lat, lng) => [lng, lat];
  const circlePolygon = useCallback((lat, lng, radiusMeters, steps = 32) => {
    const points = [];
    const dLat = radiusMeters / 111320; // deg per meter approx
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const dLng = radiusMeters / (111320 * Math.max(0.3, cosLat));
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      const plat = lat + Math.sin(t) * dLat;
      const plng = lng + Math.cos(t) * dLng;
      points.push([plng, plat]); // [lng, lat]
    }
    return points;
  }, []);

  // Verifica si una ruta interseca zonas a evitar (polígonos + niveles media/alta/muy-alta)
  const routeIntersectsHazards = useCallback((coords) => {
    if (!coords || coords.length < 2) return false;
    const INFLUENCE = { 'muy-alta': 550, 'alta': 450, 'media': 350 };
    const circles = HEAT_POINTS
      .filter(p => p.level === 'muy-alta' || p.level === 'alta' || p.level === 'media')
      .map(p => ({ center: p.center, radius: INFLUENCE[p.level] || 300 }));
    const polys = HAZARD_POLYGONS.map(poly => poly.points);
    for (let i = 0; i < coords.length - 1; i++) {
      if (segmentNearHazard(coords[i], coords[i + 1], circles, polys)) return true;
    }
    return false;
  }, []);

  const buildAvoidGeoJSON = useCallback(() => {
    // Always avoid explicit risk polygons
    const avoidPolys = HAZARD_POLYGONS.map((poly) => (
      [
        ...poly.points.map((p) => toLngLat(p[0], p[1])),
        toLngLat(poly.points[0][0], poly.points[0][1]) // close ring
      ]
    ));

    // Optionally avoid alta y muy-alta
    if (avoidHigh) {
      const INFLUENCE = { 'muy-alta': 550, 'alta': 450, 'media': 350 };
      HEAT_POINTS.forEach((p) => {
        if (p.level === 'muy-alta' || p.level === 'alta' || p.level === 'media') {
          const [lat, lng] = p.center;
          const ring = circlePolygon(lat, lng, INFLUENCE[p.level]);
          avoidPolys.push(ring);
        }
      });
    }

    if (avoidPolys.length === 0) return null;
    if (avoidPolys.length === 1) {
      return { type: 'Polygon', coordinates: [avoidPolys[0]] };
    }
    return { type: 'MultiPolygon', coordinates: avoidPolys.map((r) => [r]) };
  }, [avoidHigh, circlePolygon]);

  const computeDistanceMeters = useCallback((coords) => {
    if (!coords || coords.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      total += haversine(coords[i], coords[i + 1]);
    }
    return total;
  }, []);

  const requestRoute = useCallback(async () => {
    const key = process.env.NEXT_PUBLIC_ORS_API_KEY; // optional (proxy also checks server-side)
    if (!useRouting) {
      // Calcular resumen para ruta simulada
      const base = avoidHigh ? ROUTE_POINTS_AVOID : ROUTE_POINTS;
      const dist = computeDistanceMeters(base);
      const estDuration = dist / 8.33; // ~30 km/h
      setRouteSummary({ distanceMeters: Math.round(dist), durationSec: Math.round(estDuration), source: 'mock', provider: null });
      return; // keep mock route
    }
    const start = [ORIGIN[1], ORIGIN[0]]; // [lng,lat]
    const end = [DEST[1], DEST[0]];       // [lng,lat]
    const avoidGeo = buildAvoidGeoJSON();
    try {
      const res = await axios.post('/api/ors-route', { start, end, avoid_polygons: avoidGeo || undefined });
      const coords = res?.data?.coordinates || [];
      if (coords.length) {
        const latlng = coords.map((c) => [c[1], c[0]]);
        // Si el usuario activó evitar y la ruta entra a zonas a evitar (p.ej. OSRM sin avoid), aplica fallback seguro
        if (avoidHigh && routeIntersectsHazards(latlng)) {
          setFetchedRoute([]);
          setRouteError('Ruta externa intersecta zonas a evitar · usando alternativa segura');
          const base = ROUTE_POINTS_AVOID;
          const dist = computeDistanceMeters(base);
          const estDuration = dist / 8.33;
          setRouteSummary({ distanceMeters: Math.round(dist), durationSec: Math.round(estDuration), source: 'mock', provider: null });
          return;
        }
        setFetchedRoute(latlng);
        setRouteError(null);
        const summary = res?.data?.summary;
        const provider = res?.data?.provider || 'ors';
        if (summary && (summary.distance || summary.duration)) {
          setRouteSummary({ distanceMeters: Math.round(summary.distance || 0), durationSec: Math.round(summary.duration || 0), source: 'ors', provider });
        } else {
          const dist = computeDistanceMeters(latlng);
          const estDuration = dist / 8.33;
          setRouteSummary({ distanceMeters: Math.round(dist), durationSec: Math.round(estDuration), source: 'estimate', provider });
        }
        return;
      }
      throw new Error('Respuesta del proxy sin coordenadas');
    } catch (err) {
      console.error('Error obteniendo ruta desde proxy /api/ors-route:', err);
      setRouteError(err?.response?.data?.error || err?.message || 'Error de ruteo');
      const base = avoidHigh ? ROUTE_POINTS_AVOID : ROUTE_POINTS;
      const dist = computeDistanceMeters(base);
      const estDuration = dist / 8.33;
      setRouteSummary({ distanceMeters: Math.round(dist), durationSec: Math.round(estDuration), source: 'mock', provider: null });
    }
  }, [useRouting, avoidHigh, buildAvoidGeoJSON, computeDistanceMeters]);

  useEffect(() => { requestRoute(); }, [requestRoute]);
  // Build hazard primitives
  const hazardCircles = useMemo(() => {
    const INFLUENCE = { 'muy-alta': 550, 'alta': 450, 'media': 350, 'baja': 250 };
    return HEAT_POINTS.map((p) => ({ center: p.center, radius: INFLUENCE[p.level] || 300 }));
  }, []);

  const hazardPolygons = useMemo(() => HAZARD_POLYGONS.map((poly) => poly.points), []);

  const activeRoute = fetchedRoute.length ? fetchedRoute : (avoidHigh ? ROUTE_POINTS_AVOID : ROUTE_POINTS);

  const segments = useMemo(() => {
    const segs = [];
    for (let i = 0; i < activeRoute.length - 1; i++) {
      const a = activeRoute[i];
      const b = activeRoute[i + 1];
      segs.push({ a, b, risky: segmentNearHazard(a, b, hazardCircles, hazardPolygons) });
    }
    return segs;
  }, [hazardCircles, hazardPolygons, activeRoute]);

  const anyRisky = segments.some((s) => s.risky);

  // Render an OpenStreetMap TileLayer for a real map background (requires internet access)

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={CENTER}
        zoom={13}
        style={{ width: '100%', height: '100%', background: '#eef3f8' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* Real tiles from OpenStreetMap (toggle with showTiles) */}
        {showTiles && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
        )}

        {/* Puntos de calor por nivel (Círculos en metros -> tamaño real constante) */}
        {HEAT_POINTS.map((p, idx) => {
          const color = LEVEL_COLORS[p.level] || '#ff9966';
          const radiusMeters = p.level === 'muy-alta' ? 550 : p.level === 'alta' ? 450 : p.level === 'media' ? 350 : 250;
          const opacity = p.level === 'muy-alta' ? 0.28 : p.level === 'alta' ? 0.24 : p.level === 'media' ? 0.22 : 0.18;
          return (
            <Circle
              key={`heat-${idx}`}
              center={p.center}
              radius={radiusMeters}
              pathOptions={{ color, fillColor: color, fillOpacity: opacity, weight: 2 }}
            >
              <Tooltip>{p.label} — Incidencia {p.level.replace('-', ' ')}</Tooltip>
            </Circle>
          );
        })}

        {/* Hazard polygons */}
        {HAZARD_POLYGONS.map((poly, idx) => (
          <Polygon
            key={`hz-p-${idx}`}
            positions={poly.points}
            pathOptions={{ color: '#b91c1c', fillColor: '#ef4444', fillOpacity: 0.2, dashArray: '6 6' }}
          >
            <Tooltip>Area de riesgo</Tooltip>
          </Polygon>
        ))}

        {/* Route: draw per-segment to color risky parts in red */}
        {segments.map((s, idx) => (
          <Polyline
            key={`seg-${idx}`}
            positions={[s.a, s.b]}
            pathOptions={{ color: s.risky ? '#dc2626' : '#2563eb', weight: 5, opacity: s.risky ? 0.95 : 0.85 }}
          />
        ))}

        {/* Origin/Destination markers as circles */}
        <CircleMarker center={ORIGIN} radius={8} pathOptions={{ color: '#16a34a', fillColor: '#16a34a', fillOpacity: 1 }}>
          <Tooltip>Origen</Tooltip>
        </CircleMarker>
        <CircleMarker center={DEST} radius={8} pathOptions={{ color: '#7c3aed', fillColor: '#7c3aed', fillOpacity: 1 }}>
          <Tooltip>Destino</Tooltip>
        </CircleMarker>
      </MapContainer>

      {/* Top-right controls: toggle avoid and show summary */}
      <div
        style={{
          position: 'absolute',
          right: 12,
          top: 12,
          zIndex: 500,
          background: 'rgba(16,24,40,0.85)',
          color: 'white',
          padding: '10px 12px',
          borderRadius: 10,
          boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 600
        }}
      >
        <button
          onClick={() => setAvoidHigh((v) => !v)}
          
          style={{
            background: avoidHigh ? 'rgba(34,197,94,0.95)' : 'rgba(30,58,138,0.95)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer',
            fontWeight: 700
          }}
        >
          {avoidHigh ? 'Evitar zonas peligrosas: ON' : 'Evitar zonas peligrosas'}
        </button>
        <span style={{ opacity: 0.9 }}>
          {routeSummary.distanceMeters != null && routeSummary.durationSec != null
            ? `${(routeSummary.distanceMeters / 1000).toFixed(1)} km · ${(routeSummary.durationSec / 60).toFixed(0)} min` + (routeSummary.source ? ` · ${routeSummary.source}` : '') + (routeSummary.provider ? ` · ${routeSummary.provider}` : '')
            : '---'}
        </span>
      </div>

      {/* Risk banner (warning only) */}
      {anyRisky && (
        <div
          style={{
            position: 'absolute',
            left: 12,
            bottom: 12,
            zIndex: 400,
            background: 'rgba(220,38,38,0.95)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 10,
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 600
          }}
        >
          <span>Riesgo: la ruta se aproxima a zonas peligrosas.</span>
        </div>
      )}

      {routeError && (
        <div
          style={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            zIndex: 400,
            background: 'rgba(30,58,138,0.95)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 10,
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontWeight: 600,
            pointerEvents: 'auto'
          }}
        >
          <span>Ruta simulada · {routeError}</span>
          <button
            onClick={() => requestRoute()}
            style={{
              background: 'rgba(234, 179, 8, 0.95)',
              color: '#111827',
              border: 'none',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >Reintentar</button>
        </div>
      )}
    </div>
  );
}
