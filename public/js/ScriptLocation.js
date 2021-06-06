// SELECT ELEMENTS
const iconElement = document.querySelector(".ImgW");
const tempElement = document.querySelector(".current-temp p");
const descElement = document.querySelector(".Statue p");
const locationElement = document.querySelector(".location-name p");
const minmaxElement = document.querySelector(".Today-max_min p");
const timeElement = document.querySelector(".current-time ");
// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "40907fc3e0089e6e997d207bca288565";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    // notificationElement.style.display = "block";
    // notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    // notificationElement.style.display = "block";
    // notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
      let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].main;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.timeC = getTime(data.dt );
            weather.mine = Math.floor(data.main.temp_min -KELVIN);
            weather.maxe = Math.floor(data.main.temp_max -KELVIN);    
        })
        .then(function(){
            displayWeather();
        });
}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="animated/${weather.iconId}.svg"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    timeElement.innerHTML = `${weather.timeC}<span> ,&nbsp;</span>`; 
    minmaxElement.innerHTML =`${weather.mine}°<span>&nbsp;&nbsp;</span>${weather.maxe}°`;
    
    
    let now = new Date();
    let dDatee = document.querySelector("#dateT");
    dDatee.innerHTML = dateBuild(now);
}
// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});
function getTime(timestamp){
    var dat = new Date(timestamp * 1000);
    var ho =dat.getHours() % 24; 
    var mi =dat.getMinutes();
    return ((ho < 10 ? '0' + ho:ho)+':'+(mi < 10 ? '0' + mi:mi));
  }
  function dateBuild(da) {
    let months = ["January","Februry","March","April","May","June","July","August","September","October","November","December"];
    // let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    // let day = days[da.getDay()];
    let date = da.getDate();
    let month = months[da.getMonth()];
    // let year = da.getFullYear();
    return`  ${month} ${date} `;
  }
  