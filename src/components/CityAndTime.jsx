import sun from "../assets/sun.png";
import Clock from "./Clock";
import sunrise from "../assets/sunrise-white.png";
import sunset from "../assets/sunset-white.png";
import humidity from "../assets/humidity.png";
import windIcon from "../assets/wind.png";
import pressure from "../assets/pressure.png";
import UV from "../assets/uv.png";
import ForeCast from "./ForeCast";
import { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

const CityAndTime = ({ cityName, lon, lat, loading }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const encodedCity = encodeURIComponent(cityName);
      let url;

      if (encodedCity) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=3cc0f5b6e43ee888a0b4118685362140`;
      } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=3cc0f5b6e43ee888a0b4118685362140`;
      } else {
        toast.error("Missing City name or Coordinates");
        return;
      }

      const currentWeather = await axios.get(url);
      setWeatherData(currentWeather.data);

      const { coord } = currentWeather.data;

      const forecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=3cc0f5b6e43ee888a0b4118685362140`);
      setForecastData(forecast.data);

      const uvResponse = await axios.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=3cc0f5b6e43ee888a0b4118685362140`);
      setUvIndex(uvResponse.data.value);

    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch weather data");
    }
  }, [cityName, lat, lon]);

  useEffect(() => {
    if (cityName || (lat && lon)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [cityName, lat, lon, fetchData]);
  if (loading) {
    return <div className="text-white text-center">Loading weather data...</div>;
  }

  if (!weatherData ) {
    return <div className="text-white text-center">Unable to fetch weather data. Please try searching for a city.</div>;
  }

  const { name, main, weather, wind, sys } = weatherData;
  const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Section: City and Time */}
        <div className="w-full xl:w-1/3 h-auto md:h-72 bg-[#020231] shadow-2xl shadow-black rounded-lg p-6 flex flex-col justify-center items-center text-white">
          <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          <img src={sun} alt="weatherImage" className="w-24 select-none" />
          <Clock />
        </div>

        {/* Right Section: Weather Details */}
        <div className="flex-grow h-auto md:h-72 bg-[#020231] shadow-2xl shadow-black rounded-lg p-6 flex flex-col md:flex-row justify-around items-center md:items-stretch gap-6 text-white">
          {/* Temperature + Sunrise/Sunset */}
          <div className="flex flex-col items-center gap-6 md:gap-4">
            <h1 className="text-5xl md:text-7xl font-bold">{Math.round(main.temp)}&#8451;</h1>
            <p className="text-center">
              Feels like:{" "}
              <span className="text-lg md:text-2xl ml-2 font-bold">
                {Math.round(main.feels_like)}&#8451;
              </span>
            </p>

            <div className="flex flex-col md:flex-row xl:flex-col items-center gap-6">
              {/* Sunrise */}
              <div className="flex items-center gap-3 text-white">
                <img
                  src={sunrise}
                  alt="Sunrise"
                  className="h-8 md:h-10 select-none"
                />
                <div>
                  <h6 className="text-sm md:text-base font-semibold">Sunrise</h6>
                  <p className="text-xs md:text-sm">{sunriseTime}</p>
                </div>
              </div>

              {/* Sunset */}
              <div className="flex items-center gap-3">
                <img
                  src={sunset}
                  alt="Sunset"
                  className="h-8 md:h-10 select-none"
                />
                <div>
                  <h6 className="text-sm md:text-base font-semibold">Sunset</h6>
                  <p className="text-xs md:text-sm">{sunsetTime}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Main Weather Icon */}
          <div className="flex flex-col justify-center items-center">
            <img src={sun} alt="sun" className="w-36 h-36 md:h-52 md:w-52 select-none" />
            <p className="font-bold text-xl md:text-3xl">{weather[0].description}</p>
          </div>
          {/* Additional Weather info */}
          <div className="md:grid md:grid-cols-2 flex flex-row justify-between gap-4 md:p-4">
            <div className="flex flex-col items-center gap-2">
              <img src={humidity} alt="humidity" className="h-8 md:h-10 select-none" />
              <p>{main.humidity}%</p>
              <h6>humidity</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={windIcon} alt="windspeed" className="h-8 md:h-10 select-none" />
              <p>{wind.speed} km/h</p>
              <h6>Wind Speed</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={pressure} alt="pressure" className="h-8 md:h-10 select-none" />
              <p>{main.pressure} hpa</p>
              <h6>Pressure</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={UV} alt="UV" className="h-8 md:h-10 select-none" />
              <p>{uvIndex || 'N/A'}</p>
              <h6>UV</h6>
            </div>
          </div>
        </div>
      </div>
      <ForeCast forecastData={forecastData} />
    </>
  );
};

export default CityAndTime;
