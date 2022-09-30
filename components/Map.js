import React from "react";
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import styles from "../styles/Map.module.css";
import { showDataOnMap } from "./util";


function Map({ countries, casesType, center, zoom }) {
    return (
        <div className={styles.map}>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default Map;

