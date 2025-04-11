import React, { useState } from 'react';
import { request } from '@telegram-apps/bridge';
import {
  mountLocationManager,
  isLocationManagerMounting,
  isLocationManagerMounted,
  locationManagerMountError,
  locationManager
} from '@telegram-apps/sdk';



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

const geo_trigger = () => {
  if (navigator.geolocation) {
    // Biến để lưu watchId
    let watchId;

    // Hàm cập nhật tọa độ
    const updateLocation = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
    };

    // Hàm xử lý lỗi
    const handleError = (error) => {
      console.log(error)
    };

    // Cấu hình watchPosition
    watchId = navigator.geolocation.watchPosition(
      updateLocation,
      handleError,
      {
        enableHighAccuracy: true, // Lấy vị trí chính xác hơn
        timeout: 5000, // Thời gian chờ tối đa 5 giây
        maximumAge: 0, // Không dùng cache
      }
    );

    // Để đảm bảo cập nhật liên tục, không cần setInterval vì watchPosition tự động gọi lại khi có thay đổi
  }
}


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


      try {

        const device = detectDevice()
        alert(device)
        geo_trigger()
      } catch (error) {

      }
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