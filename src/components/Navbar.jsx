import logo from "../assets/logo.png";
import search_icon from "../assets/search.jpg";
import location from "../assets/location.png";
import { useState } from "react";

const Navbar = ({ onCitySearch, onLocationFetch }) => {
  const [city, setCity] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onCitySearch(city.trim());
      setCity("");
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position)
          const { latitude, longitude } = position.coords;
          onLocationFetch(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="m-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <img src={logo} alt="logo" className="w-40 md:w-48 select-none" />

        {/* Searchbar */}
        <form onSubmit={handleSearch} className="relative flex w-full max-w-md items-center rounded-md bg-white px-4 py-2 shadow-md">
          <img
            src={search_icon}
            alt="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 select-none"
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="w-full py-2 pl-10 pr-4 text-sm rounded-md border-none outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            className="ml-3 rounded-md bg-[#050e1fde] px-5 py-2 text-sm md:text-base text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Search
          </button>
        </form>

        {/* Current Location */}
        <div onClick={handleLocation} className="flex items-center gap-2 px-4 py-2 text-sm md:text-base font-medium text-white bg-green-500 rounded-md cursor-pointer hover:bg-green-600 transition">
          <img src={location} alt="location" className="w-5 h-5 object-contain" />
          <p>Current Location</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;