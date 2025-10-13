export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { start, end, avoid_polygons } = req.body || {};
    if (!start || !end || !Array.isArray(start) || !Array.isArray(end)) {
      return res.status(400).json({ error: 'Parámetros inválidos: se requieren start [lng,lat] y end [lng,lat]' });
    }

    const key = process.env.ORS_API_KEY || process.env.NEXT_PUBLIC_ORS_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'ORS API key no configurada en el servidor' });
    }

  const base = 'https://api.openrouteservice.org/v2/directions/driving-car';

    // Helper to normalize various ORS response shapes
    const normalize = async (resp) => {
      const data = await resp.json();
      let coords = [];
      let summary = null;
      if (data?.features?.[0]) {
        const feature = data.features[0];
        coords = feature?.geometry?.coordinates || [];
        summary = feature?.properties?.summary || null;
      } else if (data?.routes?.[0]) {
        const route = data.routes[0];
        coords = route?.geometry?.coordinates || [];
        summary = route?.summary || null;
      }
      return { coordinates: coords, summary };
    };

    // Try POST with avoid_polygons first when provided
    // Helper retry with basic backoff
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const shouldRetry = (status) => [429, 500, 502, 503, 504].includes(status);

    // Try ORS POST (if avoid_polygons)
    if (avoid_polygons) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const resp = await fetch(`${base}/geojson`, {
            method: 'POST',
            headers: {
              'Authorization': key,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ coordinates: [start, end], options: { avoid_polygons } })
          });
          if (resp.ok) {
            const { coordinates, summary } = await normalize(resp);
            if (coordinates?.length) return res.status(200).json({ provider: 'ors', coordinates, summary });
          } else if (!shouldRetry(resp.status)) {
            break; // do not retry for non-retryable statuses
          }
        } catch (e) {
          // ignore network error and retry once
        }
        await sleep(400 * (attempt + 1));
      }
    }

    // ORS GET without avoid_polygons (with small retry)
    for (let attempt = 0; attempt < 2; attempt++) {
      const params = new URLSearchParams({ api_key: key, start: `${start[0]},${start[1]}`, end: `${end[0]},${end[1]}` });
      try {
        const respGet = await fetch(`${base}/geojson?${params.toString()}`);
        if (respGet.ok) {
          const { coordinates, summary } = await normalize(respGet);
          if (coordinates?.length) return res.status(200).json({ provider: 'ors', coordinates, summary });
        } else if (!shouldRetry(respGet.status)) {
          break;
        }
      } catch (e) {
        // ignore and retry
      }
      await sleep(400 * (attempt + 1));
    }

    // Fallback: OSRM public demo (no avoid polygons support)
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
      const osrmResp = await fetch(osrmUrl);
      if (osrmResp.ok) {
        const data = await osrmResp.json();
        const route = data?.routes?.[0];
        const coords = route?.geometry?.coordinates || [];
        if (coords.length) {
          const summary = { distance: route?.distance, duration: route?.duration };
          return res.status(200).json({ provider: 'osrm', coordinates: coords, summary });
        }
      }
    } catch (e) {
      // ignore
    }

    return res.status(503).json({ error: 'Servicio de ruteo no disponible (ORS/OSRM)', details: 'Intente nuevamente más tarde.' });
  } catch (err) {
    console.error('API /api/ors-route error:', err);
    return res.status(500).json({ error: err?.message || 'Error interno' });
  }
}
