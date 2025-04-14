import React from 'react';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'

// Component con để thêm marker
const MapContent = ({ pointA, pointB }) => {
    const map = useMap();
    const markerRefs = React.useRef([]);

    // Tạo icon tùy chỉnh
    const createCustomIcon = (iconUrl) => {
        return L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
    };

    React.useEffect(() => {
        // Tạo marker cho điểm A
        const markerA = L.marker(pointA, {
            icon: createCustomIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png')
        }).bindPopup('Điểm xuất phát');
        markerA.addTo(map);
        markerRefs.current.push(markerA);

        // Tạo marker cho điểm B
        const markerB = L.marker(pointB, {
            icon: createCustomIcon('https://bitcoincash-example.github.io/website/logo.png')
        }).bindPopup('Điểm đến');
        markerB.addTo(map);
        markerRefs.current.push(markerB);

        // Fit bounds để hiển thị cả 2 điểm
        map.fitBounds([pointA, pointB]);

        return () => {
            // Xóa tất cả marker
            markerRefs.current.forEach(marker => {
                if (map && marker) {
                    map.removeLayer(marker);
                }
            });
            markerRefs.current = [];
        };
    }, [map, pointA, pointB]);

    return null;
};

const Map3 = ({ pointA, pointB }) => {
    return (
        <MapContainer
            center={pointA}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="">Move to earn</a> contributors'
            />
            <MapContent pointA={pointA} pointB={pointB} />
        </MapContainer>
    );
};

export default Map3;