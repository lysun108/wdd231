// scripts/weather-google.js
// Weather: Los Santos (Los Angeles area) using Google Weather API
// Units: Fahrenheit (IMPERIAL)

const WEATHER_API_KEY = 'AIzaSyBzT2B3bV9ame7H76-vs6dAJVMQFiN0HJo'; // ← 改成你自己的 key
const LATITUDE = 34.0522;   // Los Angeles / Los Santos
const LONGITUDE = -118.2437;
const UNITS_SYSTEM = 'IMPERIAL'; // 华氏度

// 这三个元素请在 HTML 里准备好对应的 id
const tempEl = document.querySelector('#weather-temp');
const descEl = document.querySelector('#weather-description');
const forecastEl = document.querySelector('#weather-forecast');

if (!tempEl || !descEl || !forecastEl) {
  console.warn('Weather elements not found. Make sure you have #weather-temp, #weather-description, and #weather-forecast in your HTML.');
}

async function fetchCurrentConditions() {
  const url = `https://weather.googleapis.com/v1/currentConditions:lookup` +
    `?key=${encodeURIComponent(WEATHER_API_KEY)}` +
    `&location.latitude=${LATITUDE}` +
    `&location.longitude=${LONGITUDE}` +
    `&units_system=${UNITS_SYSTEM}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Current conditions HTTP error: ${response.status}`);
  }
  return response.json();
}

async function fetchDailyForecast(days = 3) {
  const url = `https://weather.googleapis.com/v1/forecast/days:lookup` +
    `?key=${encodeURIComponent(WEATHER_API_KEY)}` +
    `&location.latitude=${LATITUDE}` +
    `&location.longitude=${LONGITUDE}` +
    `&days=${days}` +
    `&units_system=${UNITS_SYSTEM}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast HTTP error: ${response.status}`);
  }
  return response.json();
}

function renderCurrentConditions(data) {
  if (!tempEl || !descEl) return;

  const temp = data?.temperature?.degrees;
  const desc = data?.weatherCondition?.description?.text || 'N/A';

  if (typeof temp === 'number') {
    tempEl.textContent = `${Math.round(temp)}°F`;
  } else {
    tempEl.textContent = '—°F';
  }

  descEl.textContent = desc;
}

function renderForecast(data) {
  if (!forecastEl) return;

  const days = data?.forecastDays || [];
  forecastEl.innerHTML = ''; // 清空旧内容

  days.slice(0, 3).forEach((dayObj) => {
    const dateInfo = dayObj.displayDate;
    let label = 'Day';

    if (dateInfo && dateInfo.year && dateInfo.month && dateInfo.day) {
      const jsDate = new Date(dateInfo.year, dateInfo.month - 1, dateInfo.day);
      label = jsDate.toLocaleDateString('en-US', { weekday: 'short' });
    }

    const max = dayObj?.maxTemperature?.degrees;
    const min = dayObj?.minTemperature?.degrees;

    const daytimeDesc = dayObj?.daytimeForecast?.weatherCondition?.description?.text;
    const nightDesc = dayObj?.nighttimeForecast?.weatherCondition?.description?.text;
    const condition = daytimeDesc || nightDesc || '';

    const item = document.createElement('li');
    item.classList.add('forecast-item');

    const highText = typeof max === 'number' ? `${Math.round(max)}°F` : '—°F';
    const lowText  = typeof min === 'number' ? `${Math.round(min)}°F` : '—°F';

    item.textContent = `${label}: ${condition} — High ${highText} / Low ${lowText}`;
    forecastEl.appendChild(item);
  });
}

async function loadWeather() {
  try {
    if (tempEl) tempEl.textContent = 'Loading…';
    if (descEl) descEl.textContent = '';
    if (forecastEl) forecastEl.textContent = '';

    const [currentData, forecastData] = await Promise.all([
      fetchCurrentConditions(),
      fetchDailyForecast(3)
    ]);

    renderCurrentConditions(currentData);
    renderForecast(forecastData);
  } catch (err) {
    console.error('Error loading weather:', err);
    if (tempEl) tempEl.textContent = 'Weather unavailable';
    if (descEl) descEl.textContent = '';
    if (forecastEl) {
      forecastEl.innerHTML = '';
      const li = document.createElement('li');
      li.textContent = 'Unable to load forecast.';
      forecastEl.appendChild(li);
    }
  }
}

document.addEventListener('DOMContentLoaded', loadWeather);
