const ForeCast = ({ forecastData }) => {
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const getTimeString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  const forecast = forecastData ? forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5).map(item => ({
    day: getDayName(item.dt_txt),
    temp: `${Math.round(item.main.temp)}°C`,
    date: getDateString(item.dt_txt),
    icon: item.weather[0].main === 'Clear' ? '☀️' : item.weather[0].main === 'Clouds' ? '☁️' : item.weather[0].main === 'Rain' ? '🌧️' : '☀️'
  })) : [];

  const hourlyForecast = forecastData ? forecastData.list.slice(0, 8).map(item => ({
    time: getTimeString(item.dt_txt),
    temp: `${Math.round(item.main.temp)}°C`,
    icon: item.weather[0].main === 'Clear' ? '☀️' : item.weather[0].main === 'Clouds' ? '☁️' : item.weather[0].main === 'Rain' ? '🌧️' : '☀️',
    windSpeed: `${item.wind.speed} km/h`
  })) : [];

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-6">

      {/* 5 Day Forecast */}
      <div className="w-full xl:w-96 bg-[#050e1f] shadow-2xl rounded-xl text-white p-6">
        <h2 className="text-xl font-bold mb-4">5 Days Forecast</h2>

        {forecast.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-3 border-b border-white/10"
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="font-semibold">{item.temp}</span>
            <span className="text-sm">
              {item.day}, {item.date}
            </span>
          </div>
        ))}
      </div>

      {/* Hourly Forecast */}
      <div className="flex-grow bg-[#050e1f] shadow-2xl rounded-xl text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Hourly Forecast
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {hourlyForecast.map((hour, index) => (
            <div
              key={index}
              className="min-w-[110px] bg-[#1c2938] rounded-xl p-4 flex flex-col items-center gap-3 shadow-lg hover:scale-105 transition"
            >
              <p className="text-sm font-medium">{hour.time}</p>
              <span className="text-4xl">{hour.icon}</span>
              <p className="text-xs flex items-center gap-1">
                🌬️ {hour.windSpeed}
              </p>
              <p className="font-bold">{hour.temp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForeCast;
