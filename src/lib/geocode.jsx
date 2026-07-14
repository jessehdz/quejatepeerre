const MAPTILER_KEY = () => import.meta.env.VITE_MAPTILER_KEY;

async function reverseGeocode(lng, lat) {
    const url =
        `https://api.maptiler.com/geocoding/${lng},${lat}.json` +
        `?key=${MAPTILER_KEY()}` +
        `&language=es`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`MapTiler HTTP ${res.status}`);
    return res.json();
}

/*
  getMunicipality — returns the PR municipality name for a lat/lng.

  MapTiler's feature type IDs vary by data region. For Puerto Rico we've
  observed the municipality sometimes comes back as:
    - locality.xxx
    - place.xxx
    - region.xxx  (when locality/place aren't present)
    - inside the 'context' array of the most specific feature

  We log all features in dev so you can see exactly what comes back
  and adjust the priority order if needed.
*/
export async function getMunicipality(lng, lat) {
    try {
        const data = await reverseGeocode(lng, lat);
        const features = data.features || [];

        console.log('[getMunicipality] features:',
            features.map(f => ({ id: f.id, text: f.text }))
        );

        // Puerto Rico's 78 official municipios — used to validate any match
        const PR_MUNICIPIOS = new Set([
            'Adjuntas','Aguada','Aguadilla','Aguas Buenas','Aibonito',
            'Añasco','Arecibo','Arroyo','Barceloneta','Barranquitas',
            'Bayamón','Cabo Rojo','Caguas','Camuy','Canóvanas',
            'Carolina','Cataño','Cayey','Ceiba','Ciales','Cidra',
            'Coamo','Comerío','Corozal','Culebra','Dorado',
            'Fajardo','Florida','Guánica','Guayama','Guayanilla',
            'Guaynabo','Gurabo','Hatillo','Hormigueros','Humacao',
            'Isabela','Jayuya','Juana Díaz','Juncos','Lajas',
            'Lares','Las Marías','Las Piedras','Loíza','Luquillo',
            'Manatí','Maricao','Maunabo','Mayagüez','Moca',
            'Morovis','Naguabo','Naranjito','Orocovis','Patillas',
            'Peñuelas','Ponce','Quebradillas','Rincón','Río Grande',
            'Sabana Grande','Salinas','San Germán','San Juan',
            'San Lorenzo','San Sebastián','Santa Isabel','Toa Alta',
            'Toa Baja','Trujillo Alto','Utuado','Vega Alta','Vega Baja',
            'Vieques','Villalba','Yabucoa','Yauco',
        ]);

        // Strategy 1: find any feature whose text is a known PR municipio
        for (const f of features) {
            if (PR_MUNICIPIOS.has(f.text)) return f.text;
        }

        // Strategy 2: check context arrays of every feature
        for (const feature of features) {
            for (const c of (feature.context || [])) {
                if (PR_MUNICIPIOS.has(c.text)) return c.text;
            }
        }

        // Strategy 3: parse the exact address string — getExactLocation already
        // returns something like "311 Calle Tetuán, San Juan" so we can
        // extract the last comma-segment and check it against the list
        const addressFeature = features.find(f => f.id?.startsWith('address'));
        if (addressFeature?.place_name) {
            const parts = addressFeature.place_name
                .replace(/,?\s*Puerto Rico.*$/i, '')
                .split(',');
            for (const part of parts.reverse()) {
                const candidate = part.trim();
                if (PR_MUNICIPIOS.has(candidate)) return candidate;
            }
        }

        return 'Puerto Rico';
    } catch (err) {
        console.error('getMunicipality error:', err);
        return 'Puerto Rico';
    }
}

/*
  getExactLocation — returns a clean street-level address for a lat/lng.
*/
export async function getExactLocation(lng, lat) {
    try {
        const data = await reverseGeocode(lng, lat);
        const features = data.features || [];

        if (features.length === 0) return null;

        const address      = features.find(f => f.id?.startsWith('address'));
        const poi          = features.find(f => f.id?.startsWith('poi'));
        const neighborhood = features.find(f => f.id?.startsWith('neighborhood'));
        const locality     = features.find(f => f.id?.startsWith('locality'));

        const best = address || poi || neighborhood || features[0];
        if (!best) return null;

        // For address features, place_name includes the street number — use it
        if (address?.place_name) {
            return address.place_name
                .replace(/,?\s*Puerto Rico.*$/i, '')
                .trim() || null;
        }

        // For other features build "Primary, Secondary" from context
        const primary = best.text || '';
        const ctx = best.context || [];
        const ctxNeighborhood = ctx.find(c => c.id?.startsWith('neighborhood'));
        const ctxLocality     = ctx.find(c => c.id?.startsWith('locality'));
        const secondary = ctxNeighborhood?.text || ctxLocality?.text || locality?.text || '';

        const label = [primary, secondary].filter(Boolean).join(', ');
        return label || null;
    } catch (err) {
        console.error('getExactLocation error:', err);
        return null;
    }
}

/*
  forwardGeocode — converts a typed address string to coordinates + labels.
*/
export async function forwardGeocode(query) {
    try {
        const encoded = encodeURIComponent(`${query.trim()}, Puerto Rico`);
        const url =
            `https://api.maptiler.com/geocoding/${encoded}.json` +
            `?key=${MAPTILER_KEY()}` +
            `&bbox=-67.27,17.88,-65.22,18.52` +
            `&language=es` +
            `&limit=1`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`MapTiler HTTP ${res.status}`);
        const data = await res.json();

        const feature = data.features?.[0];
        if (!feature) return null;

        const [foundLng, foundLat] = feature.center;

        const raw = feature.place_name || query.trim();
        const exactLocation = raw.replace(/,?\s*Puerto Rico.*$/i, '').trim();

        const municipality = await getMunicipality(foundLng, foundLat);

        return { lng: foundLng, lat: foundLat, municipality, exactLocation };
    } catch (err) {
        console.error('forwardGeocode error:', err);
        return null;
    }
}
