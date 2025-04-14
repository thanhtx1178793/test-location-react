import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'

const Map = ({ pointA, pointB }) => {
    const mapRef = React.useRef();
    const routingControlRef = React.useRef();
    const markerRefs = React.useRef([]);

    // Tạo icon tùy chỉnh
    const createCustomIcon = (iconUrl) => {
        return L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 32], // Kích thước icon
            iconAnchor: [16, 32], // Điểm neo của icon (phần dưới cùng)
            popupAnchor: [0, -32] // Vị trí popup so với icon
        });
    };

    React.useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        // Tạo control routing
        routingControlRef.current = L.Routing.control({
            waypoints: [
                L.latLng(pointA[0], pointA[1]),
                L.latLng(pointB[0], pointB[1])
            ],
            routeWhileDragging: true,
            lineOptions: {
                styles: [{ color: 'blue', weight: 4 }]
            },
            createMarker: function (i, waypoint, n) {
                // Sử dụng icon tùy chỉnh cho marker
                const iconUrl = i === 0
                    ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' // Icon cho điểm xuất phát
                    : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'; // Icon cho điểm đến

                const marker = L.marker(waypoint.latLng, {
                    icon: createCustomIcon(iconUrl)
                }).bindPopup(i === 0 ? 'Điểm xuất phát' : 'Điểm đến');

                markerRefs.current.push(marker);
                return marker;
            },
            show: false, // Ẩn phần chỉ dẫn
            addWaypoints: false,
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: true,
        }).addTo(map);

        map.fitBounds([pointA, pointB]);

        return () => {
            // Xóa tất cả marker
            markerRefs.current.forEach(marker => {
                if (map && marker) {
                    map.removeLayer(marker);
                }
            });
            markerRefs.current = [];

            // Xóa routing control
            if (map && routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [pointA, pointB]);

    return (
        <MapContainer
            ref={mapRef}
            center={pointA}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="">Move to earn</a> contributors'
            />
        </MapContainer>
    );
};

export default Map;