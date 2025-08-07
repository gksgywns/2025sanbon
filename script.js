
const API_KEY = '4f84a09ee78d41ea82c24600250708';
const API_BASE_URL = 'https://api.weatherapi.com/v1';

// 한국어 도시명을 영어로 매핑하는 객체
const koreanToEnglish = {
    '서울': 'Seoul',
    '부산': 'Busan',
    '대구': 'Daegu',
    '인천': 'Incheon',
    '광주': 'Gwangju',
    '대전': 'Daejeon',
    '울산': 'Ulsan',
    '수원': 'Suwon',
    '창원': 'Changwon',
    '고양': 'Goyang',
    '용인': 'Yongin',
    '성남': 'Seongnam',
    '청주': 'Cheongju',
    '부천': 'Bucheon',
    '화성': 'Hwaseong',
    '남양주': 'Namyangju',
    '전주': 'Jeonju',
    '천안': 'Cheonan',
    '안산': 'Ansan',
    '안양': 'Anyang',
    '평택': 'Pyeongtaek',
    '시흥': 'Siheung',
    '파주': 'Paju',
    '의정부': 'Uijeongbu',
    '김해': 'Gimhae',
    '강릉': 'Gangneung',
    '춘천': 'Chuncheon',
    '목포': 'Mokpo',
    '여수': 'Yeosu',
    '순천': 'Suncheon',
    '원주': 'Wonju',
    '경주': 'Gyeongju',
    '제주': 'Jeju',
    '포항': 'Pohang',
    '진주': 'Jinju',
    '마산': 'Masan',
    '구미': 'Gumi',
    '안동': 'Andong',
    '도쿄': 'Tokyo',
    '오사카': 'Osaka',
    '교토': 'Kyoto',
    '나고야': 'Nagoya',
    '요코하마': 'Yokohama',
    '베이징': 'Beijing',
    '상하이': 'Shanghai',
    '홍콩': 'Hong Kong',
    '타이베이': 'Taipei',
    '방콕': 'Bangkok',
    '싱가포르': 'Singapore',
    '쿠알라룸푸르': 'Kuala Lumpur',
    '자카르타': 'Jakarta',
    '하노이': 'Hanoi',
    '호치민': 'Ho Chi Minh City',
    '마닐라': 'Manila',
    '런던': 'London',
    '파리': 'Paris',
    '베를린': 'Berlin',
    '로마': 'Rome',
    '마드리드': 'Madrid',
    '암스테르담': 'Amsterdam',
    '뉴욕': 'New York',
    '로스앤젤레스': 'Los Angeles',
    '시카고': 'Chicago',
    '라스베가스': 'Las Vegas',
    '샌프란시스코': 'San Francisco',
    '워싱턴': 'Washington',
    '시드니': 'Sydney',
    '멜버른': 'Melbourne'
};

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

// DOM elements for weather data
const currentTemp = document.getElementById('currentTemp');
const weatherIcon = document.getElementById('weatherIcon');
const cityName = document.getElementById('cityName');
const weatherDescription = document.getElementById('weatherDescription');
const lastUpdated = document.getElementById('lastUpdated');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');
const uvIndex = document.getElementById('uvIndex');

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Load default city on page load
window.addEventListener('load', () => {
    cityInput.value = 'Seoul';
    searchWeather();
});

async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('도시 이름을 입력해주세요.');
        return;
    }
    
    // 한국어 도시명을 영어로 변환
    const searchCity = koreanToEnglish[city] || city;
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(searchCity)}&aqi=no`);
        
        if (!response.ok) {
            throw new Error('날씨 정보를 찾을 수 없습니다.');
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('날씨 정보를 가져올 수 없습니다. 도시 이름을 확인해주세요.');
    }
}

function displayWeather(data) {
    const { location, current } = data;
    
    // Update weather information
    currentTemp.textContent = Math.round(current.temp_c);
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.alt = current.condition.text;
    cityName.textContent = `${location.name}, ${location.country}`;
    weatherDescription.textContent = current.condition.text;
    lastUpdated.textContent = `마지막 업데이트: ${formatDateTime(current.last_updated)}`;
    
    // Update weather stats
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    visibility.textContent = `${current.vis_km} km`;
    pressure.textContent = `${current.pressure_mb} mb`;
    uvIndex.textContent = current.uv;
    
    // Update progress bars with animations
    updateProgressBars(current);
    
    hideLoading();
    showWeatherInfo();
}

function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showWeatherInfo() {
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';
}

function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.style.display = 'none';
    hideLoading();
}

function showLoading() {
    loading.style.display = 'block';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function updateProgressBars(current) {
    // 체감온도 (-30°C ~ 50°C 기준으로 정규화)
    const feelsLikePercent = Math.max(0, Math.min(100, ((current.feelslike_c + 30) / 80) * 100));
    document.getElementById('feelsLikeProgress').style.width = `${feelsLikePercent}%`;
    
    // 습도 (0% ~ 100%)
    document.getElementById('humidityProgress').style.width = `${current.humidity}%`;
    
    // 풍속 (0 ~ 100 km/h 기준으로 정규화)
    const windPercent = Math.min(100, (current.wind_kph / 100) * 100);
    document.getElementById('windSpeedProgress').style.width = `${windPercent}%`;
    
    // 가시거리 (0 ~ 50km 기준으로 정규화)
    const visibilityPercent = Math.min(100, (current.vis_km / 50) * 100);
    document.getElementById('visibilityProgress').style.width = `${visibilityPercent}%`;
    
    // 기압 (950 ~ 1050 mb 기준으로 정규화)
    const pressurePercent = Math.max(0, Math.min(100, ((current.pressure_mb - 950) / 100) * 100));
    document.getElementById('pressureProgress').style.width = `${pressurePercent}%`;
    
    // 자외선 지수 (0 ~ 11+ 기준으로 정규화)
    const uvPercent = Math.min(100, (current.uv / 11) * 100);
    document.getElementById('uvIndexProgress').style.width = `${uvPercent}%`;
}
