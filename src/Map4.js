import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const Map4 = ({ pointA, pointB }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [mapStyle, setMapStyle] = useState('osm');

    const mapStyles = {
        osm: {
            name: 'OpenStreetMap',
            source: new OSM()
        },
        carto: {
            name: 'Carto Light',
            source: new XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
            })
        },
        stamen: {
            name: 'Stamen Terrain',
            source: new XYZ({
                url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg'
            })
        },
        esri: {
            name: 'ESRI World Topo',
            source: new XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
            })
        },
        cyclosm: {
            name: 'CyclOSM',
            source: new XYZ({
                url: 'https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'
            })
        },
        thunderforest: {
            name: 'Thunderforest Landscape',
            source: new XYZ({
                url: 'https://{a-c}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38'
            })
        },
        mapbox: {
            name: 'Mapbox Streets',
            source: new XYZ({
                url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
            })
        },
        openTopo: {
            name: 'OpenTopoMap',
            source: new XYZ({
                url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
            })
        },
        watercolor: {
            name: 'Stamen Watercolor',
            source: new XYZ({
                url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'
            })
        },
        cartoDark: {
            name: 'Carto Dark',
            source: new XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
            })
        },
        darkMatter: {
            name: 'Dark Matter',
            source: new XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}.png'
            })
        },
        midnight: {
            name: 'Midnight Commander',
            source: new XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/midnight/{z}/{x}/{y}.png'
            })
        },
        mapboxDark: {
            name: 'Mapbox Dark',
            source: new XYZ({
                url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
            })
        },
        thunderforestDark: {
            name: 'Thunderforest Dark',
            source: new XYZ({
                url: 'https://{a-c}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38'
            })
        },
        esriDark: {
            name: 'ESRI Dark Gray',
            source: new XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            })
        },
        cyclosmDark: {
            name: 'CyclOSM Dark',
            source: new XYZ({
                url: 'https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm-dark/{z}/{x}/{y}.png'
            })
        },
        vintage: {
            name: 'Vintage',
            source: new XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}.png'
            })
        },
        positron: {
            name: 'Positron',
            source: new XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/positron/{z}/{x}/{y}.png'
            })
        },
        toner: {
            name: 'Stamen Toner',
            source: new XYZ({
                url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
            })
        },
        tonerLite: {
            name: 'Stamen Toner Lite',
            source: new XYZ({
                url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
            })
        },
        tonerBackground: {
            name: 'Stamen Toner Background',
            source: new XYZ({
                url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png'
            })
        },
        tonerHybrid: {
            name: 'Stamen Toner Hybrid',
            source: new XYZ({
                url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}.png'
            })
        },
        tonerLines: {
            name: 'Stamen Toner Lines',
            source: new XYZ({
                url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.png'
            })
        },
        tonerLabels: {
            name: 'Stamen Toner Labels',
            source: new XYZ({
                url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png'
            })
        }
    };

    useEffect(() => {
        if (!mapInstance.current) {
            // Tạo map instance
            const map = new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: mapStyles[mapStyle].source
                    })
                ],
                view: new View({
                    center: fromLonLat([pointA[1], pointA[0]]),
                    zoom: 13
                })
            });

            // Tạo vector layer cho markers
            const vectorLayer = new VectorLayer({
                source: new VectorSource()
            });
            map.addLayer(vectorLayer);

            // Tạo style cho marker A
            const markerA = new Feature({
                geometry: new Point(fromLonLat([pointA[1], pointA[0]]))
            });
            markerA.setStyle(new Style({
                image: new Icon({
                    src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                    scale: 0.5,
                    anchor: [0.5, 1]
                })
            }));

            // Tạo style cho marker B
            const markerB = new Feature({
                geometry: new Point(fromLonLat([pointB[1], pointB[0]]))
            });
            markerB.setStyle(new Style({
                image: new Icon({
                    src: 'https://bitcoincash-example.github.io/website/logo.png',
                    scale: 0.1,
                    anchor: [0.5, 1]
                })
            }));

            // Thêm markers vào vector layer
            vectorLayer.getSource().addFeatures([markerA, markerB]);

            // Fit view để hiển thị cả 2 điểm
            const extent = vectorLayer.getSource().getExtent();
            map.getView().fit(extent, {
                padding: [50, 50, 50, 50],
                maxZoom: 15
            });

            mapInstance.current = map;
        } else {
            // Cập nhật layer khi style thay đổi
            const baseLayer = mapInstance.current.getLayers().getArray()[0];
            baseLayer.setSource(mapStyles[mapStyle].source);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(undefined);
                mapInstance.current = null;
            }
        };
    }, [pointA, pointB, mapStyle]);

    return (
        <div style={{ position: 'relative' }}>
            <div
                ref={mapRef}
                style={{
                    height: '300px',
                    width: '100%'
                }}
            />
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                backgroundColor: 'white',
                padding: '5px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                <select
                    value={mapStyle}
                    onChange={(e) => setMapStyle(e.target.value)}
                    style={{
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                >
                    {Object.entries(mapStyles).map(([key, style]) => (
                        <option key={key} value={key}>{style.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Map4;