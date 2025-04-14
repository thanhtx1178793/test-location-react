import React, { useState, useEffect } from 'react';
import { request } from '@telegram-apps/bridge';
import {
  mountLocationManager,
  isLocationManagerMounting,
  isLocationManagerMounted,
  locationManagerMountError,
  locationManager
} from '@telegram-apps/sdk';

import Map from './Map';
import MapComponent from './Map2';
import Map3 from './Map3';
import Map4 from './Map4';

const detectDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'iOS';
  }
  if (/android/.test(userAgent)) {
    return 'Android';
  }
  return 'Other';
};


function LocationTracker() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [course, setCourse] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isInited, setIsInited] = useState(false);

  const positionB = [21.0276, 105.7909]; // Điểm A (Hà Nội)

  useEffect(() => {
    // Kiểm tra hỗ trợ Geolocation
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ Geolocation');
      return;
    }


    if (detectDevice() == 'Android') {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed: currentSpeed, heading } = position.coords;
          // setLatitude(latitude);
          // setLongitude(longitude);
          //setSpeed(currentSpeed || 0);
          //setCourse(heading || 0);
        },
        (error) => {
          console.error('Lỗi khi lấy vị trí:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 500,
          //maximumAge: 500 // Cập nhật vị trí mỗi 5 giây
        }
      );

      // Dọn dẹp khi component unmount
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }

    // Theo dõi vị trí với watchPosition

  }, []);

  useEffect(() => {
    // Kiểm tra hỗ trợ Geolocation
    if (!navigator.geolocation) {
      alert('Geolocation không được hỗ trợ trên trình duyệt này.');
      return;
    }

    // Theo dõi vị trí với watchPosition
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        // setCoords({ latitude, longitude, accuracy });
      },
      (err) => {
        //alert(err.message);
      },
      {
        enableHighAccuracy: true, // Độ chính xác cao
        timeout: 5000, // Chờ tối đa 5 giây
        maximumAge: 0, // Không dùng cache
      }
    );

    // Dọn dẹp khi component unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

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
    <>
      <div style={{ padding: '20px', marginBottom: '20px' }}>
        <div >
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

      {/* <div style={{ height: '60px', width: '90%', marginBottom: '20px' }}>
        {latitude != 0 && longitude != 0 ? (
          <Map3 pointA={[latitude, longitude]} pointB={positionB} />
        ) : (
          <div>Loading...</div>
        )}
      </div> */}


      <div style={{ height: '60px', width: '90%', marginBottom: '20px' }}>
        {latitude != 0 && longitude != 0 ? (
          <Map4 pointA={[latitude, longitude]} pointB={positionB} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {/* 
      <div style={{ height: '60px', width: '90%', marginBottom: '20px' }}>
        {latitude != 0 && longitude != 0 ? (
          <MapComponent pointA={[latitude, longitude]} pointB={positionB} />
        ) : (
          <div>Loading...</div>
        )}
      </div> */}

    </>
  );
}

export default LocationTracker; 