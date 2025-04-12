import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const RoutingControl = ({ pointA, pointB }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !pointA || !pointB) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(pointA.lat, pointA.lng), // Điểm A
                L.latLng(pointB.lat, pointB.lng), // Điểm B
            ],
            lineOptions: {
                styles: [{ color: '#3388ff', weight: 4 }],
            },
            show: false, // Ẩn phần chỉ dẫn
            addWaypoints: false,
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: true,
        }).addTo(map);

        return () => {
            // map.removeControl(routingControl.current); // Xóa control khi pointA hoặc pointB thay đổi
        };
    }, [map, pointA, pointB]);

    return null;
};

const MapComponent = () => {
    const position = [51.505, -0.09];
    // Ví dụ: Hai điểm đầu vào
    const [pointA, setPointA] = React.useState({ lat: 51.505, lng: -0.09 });
    const [pointB, setPointB] = React.useState({ lat: 51.5, lng: -0.1 });

    // Hàm cập nhật điểm (ví dụ)
    const updatePoints = () => {
        setPointA({ lat: 51.51, lng: -0.08 });
        setPointB({ lat: 51.49, lng: -0.11 });
    };

    return (
        <div>
            <button onClick={updatePoints}>Cập nhật điểm</button>
            <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <RoutingControl pointA={pointA} pointB={pointB} />
            </MapContainer>
        </div>
    );
};

export default MapComponent;