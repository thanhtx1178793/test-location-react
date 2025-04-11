import React, { useState } from 'react';
import { request } from '@telegram-apps/bridge';
import {
  mountLocationManager,
  isLocationManagerMounting,
  isLocationManagerMounted,
  locationManagerMountError,
  locationManager
} from '@telegram-apps/sdk';

function LocationTracker() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [course, setCourse] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isInited, setIsInited] = useState(false);

  const requestAccess = async () => {
    if (!isInited) {
      await initLocation();
    }
    await request('location_requested');
  }

  const initLocation = async () => {
    if (mountLocationManager.isAvailable()) {
      try {
        const promise = mountLocationManager();
        isLocationManagerMounting(); // true
        await promise;
        isLocationManagerMounting(); // false
        isLocationManagerMounted(); // true
        setIsInited(true);
      } catch (err) {
        locationManagerMountError(); // equals "err"
        isLocationManagerMounting(); // false
        isLocationManagerMounted(); // false
      }
    }
  }

  const updateLocation = async () => {
    if (!isInited) {
      await initLocation();
    }
    const location = await locationManager.requestLocation();
    setLatitude(location.latitude);
    setLongitude(location.longitude);
    setCourse(location.course ? location.course : -1);
    setSpeed(location.speed ? location.speed : -1);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div>Latitude: {latitude}</div>
        <div>Longitude: {longitude}</div>
        <div>Course: {course}</div>
        <div>Speed: {speed}</div>
      </div>
      <button
        onClick={updateLocation}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Update Location
      </button>
      <button
        onClick={requestAccess}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Grant Access
      </button>
    </div>
  );
}

export default LocationTracker; 