import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CityAndTime from "./components/CityAndTime";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const [cityName, setCityName] = useState("Surat");
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCitySearch = (city) => {
    setCityName(city);
    setLat(null);
    setLon(null);
    setLoading(false);
  };

  const handleFetchLocation = (latitude, logtitude) => {
    setLat(latitude);
    setLon(logtitude);
    setCityName("");
    setLoading(false);
  };

  useEffect(() => {
    const fetchLocation = () => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          const timeoutId = setTimeout(() => reject(new Error('Location timeout')), 5000);
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              clearTimeout(timeoutId);
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              reject(error);
            }
          );
        } else {
          reject(new Error('Geolocation not supported'));
        }
      });
    };

    fetchLocation()
      .then((position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLon(longitude);
        // Show loading for at least 2 seconds
        setLoading(false)
        setTimeout(() => setLoading(false), 2000);
      })
      .catch((error) => {
        console.error("Error getting location:", error);
        // Default to Surat if location fetch fails
        setCityName("Surat");
        // Show loading for at least 2 seconds
        setTimeout(() => setLoading(false), 2000);
      });
  }, []);
  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="w-full h-full">
        <Navbar onCitySearch ={handleCitySearch} onLocationFetch={handleFetchLocation} />
      </div>
      <div>
        <CityAndTime cityName={cityName} logtitude={lon} latitude={lat} loading={loading} />
      </div>
    </div>
  );
};

export default App;
