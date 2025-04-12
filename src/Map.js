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
    const polylineRef = React.useRef();

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
                return L.marker(waypoint.latLng)
                    .bindPopup(i === 0 ? 'Điểm xuất phát' : 'Điểm đến');
            },
            show: false, // Ẩn phần chỉ dẫn
            addWaypoints: false,
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: true,
        }).addTo(map);

        map.fitBounds([pointA, pointB]);

        return () => {
            // if (map && routingControlRef.current) {
            //     map.removeControl(routingControlRef.current);
            // }
            // if (map && polylineRef.current) {
            //     map.removeLayer(polylineRef.current);
            // }
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