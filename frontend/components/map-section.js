// frontend/components/map-section.js
// Вимагає глобальний mapboxgl (підключений у theme.liquid)

const FIXED_ZOOM = 13; // фіксований зум для всіх станів

const geocodeCache = new Map();

async function geocodeAddress(address, token) {
  const key = `${address}|${token}`;
  if (geocodeCache.has(key)) return geocodeCache.get(key);

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?limit=1&access_token=${token}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding failed');

  const data = await res.json();
  const feature = data.features?.[0];
  const coords = feature ? { lng: feature.center[0], lat: feature.center[1] } : null;

  geocodeCache.set(key, coords);
  return coords;
}

function buildMarkerElement(labelText = 'YUUM') {
  const el = document.createElement('div');
  el.className = 'yuum-marker';
  el.innerHTML = `
    <div class="yuum-marker__label">${labelText}</div>
    <div class="yuum-marker__pin">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <rect width="48" height="48" rx="24" fill="#474747"/>
        <path d="M24.001 13.0996C28.8175 13.0996 32.7292 17.0107 32.7295 21.8271C32.7295 24.803 31.3657 27.5004 29.665 29.6826C28.4132 31.2896 27.0004 32.595 25.8975 33.5C25.3469 33.9518 24.8754 34.3025 24.543 34.5391C24.3768 34.6573 24.2453 34.747 24.1562 34.8066C24.1119 34.8363 24.078 34.8585 24.0557 34.873C24.0445 34.8803 24.0356 34.8862 24.0303 34.8896L24.001 34.8994C23.9664 34.8852 23.9581 34.8801 23.9473 34.873C23.9249 34.8585 23.891 34.8363 23.8467 34.8066C23.7577 34.747 23.6261 34.6572 23.46 34.5391C23.1274 34.3026 22.6558 33.9523 22.1055 33.501H22.1064C21.0034 32.594 19.5906 31.2906 18.3389 29.6826H18.3379C16.6373 27.5004 15.2734 24.8031 15.2734 21.8271C15.2737 17.0109 19.1847 13.0999 24.001 13.0996ZM24.001 17.5283C21.6276 17.5286 19.7024 19.4538 19.7021 21.8271C19.7021 24.2003 21.627 26.1287 24.001 26.1289C26.3751 26.1289 28.3008 24.2005 28.3008 21.8271C28.3005 19.4536 26.3746 17.5283 24.001 17.5283Z" stroke="white"/>
      </svg>
    </div>
  `;
  return el;
}

function buildPopupHTML(title, html) {
  return `
    <div class="yuum-popup">
      ${title ? `<strong>${title}</strong>` : ``}
      ${html || ``}
    </div>
  `;
}

export async function initMapSections(root = document) {
  const nodes = Array.from(root.querySelectorAll('[data-mapbox-section]'));
  if (!nodes.length) return;

  nodes.forEach(async (mapEl) => {
    try {
      const token = mapEl.dataset.token;
      if (!token) return;

      const style = mapEl.dataset.style || 'mapbox://styles/mapbox/streets-v12';
      const defLng = parseFloat(mapEl.dataset.defaultLng || '-0.1276');
      const defLat = parseFloat(mapEl.dataset.defaultLat || '51.5072');

      // ініт карти з фіксованим зумом
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: mapEl,
        style,
        center: [defLng, defLat],
        zoom: FIXED_ZOOM
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // вимикаємо zoom на коліщатку
      map.scrollZoom.disable();

      // лишаємо зум-жести, але блокуємо перетягування і обертання
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
      map.dragPan.disable();

      // дістаємо JSON з даними маркерів
      const sectionRoot = mapEl.closest('.map-section__inner') || mapEl.parentElement || document;
      const sectionId = (mapEl.id || '').replace('mapboxContainer-', '');
      const dataScript = sectionRoot.querySelector(`#map-data-${sectionId}`);

      let items = [];
      if (dataScript && dataScript.textContent) {
        try { items = JSON.parse(dataScript.textContent); } catch { items = []; }
      }

      const points = [];

      for (const it of items) {
        let lng = parseFloat(it.lng);
        let lat = parseFloat(it.lat);

        if (!(isFinite(lng) && isFinite(lat)) && it.address) {
          const coords = await geocodeAddress(it.address, token);
          if (coords) { lng = coords.lng; lat = coords.lat; }
        }
        if (!(isFinite(lng) && isFinite(lat))) continue;

        const markerEl = buildMarkerElement(it.label);
        new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 35, closeButton: false })
            .setHTML(buildPopupHTML(it.popup_title, it.popup_html)))
          .addTo(map);

        points.push([lng, lat]);
      }

      // центр і зум — фіксуємо
      if (points.length === 1) {
        map.jumpTo({ center: points[0], zoom: FIXED_ZOOM });
      } else if (points.length >= 2) {
        const bounds = points.reduce(
          (b, p) => b.extend(p),
          new mapboxgl.LngLatBounds(points[0], points[0])
        );
        map.jumpTo({ center: bounds.getCenter(), zoom: FIXED_ZOOM });
      } else {
        map.jumpTo({ center: [defLng, defLat], zoom: FIXED_ZOOM });
      }
    } catch (err) {
      console.error('Map section init error:', err);
    }
  });
}

export default initMapSections;
