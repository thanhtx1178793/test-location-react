import React from 'react';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'

// Component con để thêm marker
const MapContent = ({ pointA, pointB }) => {
    const map = useMap();
    const markerRefs = React.useRef([]);
    const radarLineRef = React.useRef(null);
    const angleRef = React.useRef(0);
    const animationFrameRef = React.useRef(null);
    const lastTimeRef = React.useRef(0);

    // Tạo icon tùy chỉnh
    const createCustomIcon = (iconUrl) => {
        return L.icon({
            iconUrl: iconUrl,
            iconSize: [16, 16],
            iconAnchor: [16, 16],
            popupAnchor: [0, -32]
        });
    };

    // Hàm tính toán điểm cuối của thanh quét
    const calculateEndPoint = (center, radius, angle) => {
        const rad = angle * Math.PI / 180;
        const lat = center[0] + (radius / 111320) * Math.cos(rad);
        const lng = center[1] + (radius / (111320 * Math.cos(center[0] * Math.PI / 180))) * Math.sin(rad);
        return [lat, lng];
    };

    // Hàm tạo thanh quét radar
    const createRadarLine = (center, radius, angle) => {
        const endPoint = calculateEndPoint(center, radius, angle);
        return L.polyline([center, endPoint], {
            color: 'red',
            weight: 1,
            opacity: 0.8
        });
    };

    // Hàm animation radar
    const animateRadar = (timestamp) => {
        if (!lastTimeRef.current) {
            lastTimeRef.current = timestamp;
        }

        const deltaTime = timestamp - lastTimeRef.current;
        if (deltaTime >= 16) { // ~60fps
            angleRef.current = (angleRef.current + 1) % 360;
            if (radarLineRef.current) {
                map.removeLayer(radarLineRef.current);
            }
            radarLineRef.current = createRadarLine(pointB, 500, angleRef.current);
            radarLineRef.current.addTo(map);
            lastTimeRef.current = timestamp;
        }

        animationFrameRef.current = requestAnimationFrame(animateRadar);
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

        // Vẽ vòng tròn quét xung quanh điểm B với bán kính 500m
        const circle = L.circle(pointB, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: 500, // 500m
            weight: 1 // Giảm độ dày viền
        }).addTo(map);
        markerRefs.current.push(circle);

        // Bắt đầu animation radar
        animationFrameRef.current = requestAnimationFrame(animateRadar);

        // Fit bounds để hiển thị cả 2 điểm và vòng tròn
        const bounds = L.latLngBounds([pointA, pointB]);
        bounds.extend(circle.getBounds());
        map.fitBounds(bounds);

        return () => {
            // Dừng animation và xóa tất cả marker, vòng tròn và thanh quét
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (radarLineRef.current) {
                map.removeLayer(radarLineRef.current);
            }
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
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="">Move to earn</a>'
            />
            <MapContent pointA={pointA} pointB={pointB} />
        </MapContainer>
    );
};

export default Map3;