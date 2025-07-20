import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapPathFinder = () => {
  const mapRef = useRef(null);
  const selectionStateRef = useRef('start');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState(null);
  const [algorithm, setAlgorithm] = useState('dijkstra'); 
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([20.5937, 78.9629], 5);
      L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_ACCESS_TOKEN, {
        attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1
      }).addTo(mapRef.current);

      mapRef.current.on('click', function(e) {
        const { lat, lng } = e.latlng;
        
        if (selectionStateRef.current === 'start') {
          markers.forEach(marker => marker.remove());
          setMarkers([]);
          
          const startMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'start-marker',
              html: '<div style="background-color: green; width: 15px; height: 15px; border-radius: 50%;"></div>'
            })
          }).addTo(mapRef.current);
          
          setMarkers(prev => [...prev, startMarker]);
          setStart({ lat, lng });
          selectionStateRef.current = 'end';
        } else {
          const endMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'end-marker',
              html: '<div style="background-color: red; width: 15px; height: 15px; border-radius: 50%;"></div>'
            })
          }).addTo(mapRef.current);
          
          setMarkers(prev => [...prev, endMarker]);
          setEnd({ lat, lng });
          selectionStateRef.current = 'start';
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const calculatePath = async () => {
    if (!start || !end || !mapRef.current) return;

    if (route) {
      mapRef.current.removeLayer(route);
      setRoute(null);
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates;
        const path = coordinates.map(([lng, lat]) => ({ lat, lng }));
        const segments = [];
        for (let i = 0; i < path.length - 1; i++) {
          segments.push({
            start: path[i],
            end: path[i + 1],
            distance: calculateDistance(path[i], path[i + 1])
          });
        }

        function calculateDistance(point1, point2) {
          const R = 6371; 
          const dLat = (point2.lat - point1.lat) * Math.PI / 180;
          const dLon = (point2.lng - point1.lng) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        }

        const pathCoordinates = path.map(point => [point.lat, point.lng]);

        const polyline = L.polyline(pathCoordinates, {
          color: '#4F46E5',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10',
          lineCap: 'round',
          lineJoin: 'round',
          className: 'animated-path'
        }).addTo(mapRef.current);

        const bounds = L.latLngBounds(pathCoordinates);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });

        setRoute(polyline);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  useEffect(() => {
    if (start && end) {
      calculatePath();
    }
  }, [start, end]);

  useEffect(() => {
    if (mapRef.current && Array.isArray(route)) {
      const latlngs = route.map(([lng, lat]) => [lat, lng]);
      L.polyline(latlngs, { color: 'purple', weight: 5 }).addTo(mapRef.current);
    }
  }, [route]);

  const resetSelection = () => {
    setStart(null);
    setEnd(null);

    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current.removeLayer(layer);
        }
      });
    }

    setMarkers([]);
        setRoute(null);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_ACCESS_TOKEN, {
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1
    }).addTo(mapRef.current);
    selectionStateRef.current = 'start';
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Find Shortest Path on Map</h2>
      <div id="map" style={{ height: '500px', width: '100%', maxWidth: '800px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}></div>
      <div className="mb-4">
        <button onClick={resetSelection} className="bg-purple-600 text-white px-4 py-2 rounded-lg">Reset</button>
      </div>
      <div>
        <p>Click on the map to select start and end points.</p>
        {start && <p>Start: {start.lat.toFixed(4)}, {start.lng.toFixed(4)}</p>}
        {end && <p>End: {end.lat.toFixed(4)}, {end.lng.toFixed(4)}</p>}
      </div>
    </div>
  );
};

export default MapPathFinder;
