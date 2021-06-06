 var city="";
// var for left -side
var searchCity = $(".city-n");
var searchButton = $(".search-s");
var clearBtn = $(".btn-c");
// var for right - side
var  currentLocation = $(".Location p");
let  btn_Tc = document.querySelector(".b-c");
let  btn_Tf =document.querySelector(".b-f");
var  iconId = $(".weather-icon #im");
var  tempp   = $(".temperature-value p"); 
var  btn_sunset = $(".sunset"); 
var  btn_sunrise = $(".sunrise");
var  wind = $("#wind-N");
var hum = $("#hum-N");
var dailyTemp = $(".m-Min p");
// var cloude = $("#Cloud-N");
var UVIndex = $("#Uv-index");
var visibility = $("#Visble-N");
var sunS =  $("#sun");
var risE =  $("#rise");
var sCity=[];


function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//Set up the API key
var APIKey="40907fc3e0089e6e997d207bca288565";
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}
function currentWeather(city){
    // Here we build the URL so we can get a data from server side.
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
     
       console.log(response);
       let icons = document.querySelector(".weather-icon");
       icons.innerHTML =`<img src="./animated/${response.weather[0].icon}.svg"/>`;
       
       var desc = response.weather[0].description;
       $(".temperature-description p").html(desc);

       var dTMi = Math.floor(response.main.temp_min -273);
       var dTMa = Math.floor(response.main.temp_max -273); 
       $(dailyTemp).html((dTMi).toFixed()+"°"+" "+(dTMa).toFixed()+"°"); 

       var tempF = (response.main.temp - 273.15);
       $(tempp).html((tempF).toFixed()+"&#8451");

       let now = new Date();
       let dDate = document.querySelector(".d_date p");
       dDate.innerHTML = dateBuilder(now);

       var Country = response.sys.country;
       $(currentLocation).html(response.name+","+Country);

       windSpeed = response.wind.speed;
       $(wind).html(windSpeed+"Km/h");

       humiDtiy = response.main.humidity;
       $(hum).html(humiDtiy+"%");

    //    clouds = response.clouds.all;
    //    $(cloude).html(clouds+"%");

       visiBility = response.visibility;
       $(visibility).html(visiBility +"km/h");

       sunsi = extractTime(response.sys.sunset);
       $(sunS).html(sunsi);
       sunri = extractTime(response.sys.sunrise);
       $(risE).html(sunri);
        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UvIndex(response.coord.lon,response.coord.lat);
       forecast(response.id);
  const DAYS = {
  0: "Sunday",
  1:"Monday",
  2: "Tuesday",
  3:"Wednesday",
  4:"Thursday",
  5:"Friday",
  6:"Saturday",
};
// This function returns the UVIindex response.
function UvIndex(ln,lt){
    //lets build the url for uvindex.
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(UVIndex).html(response.value);
            });
}    
// Here we display the 5 days forecast for the current city.
function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var datee= DAYS[new Date((response.list[((i+1)*8)-1].dt)*1000).getDay()];
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurll = "./animated/" + iconcode + ".svg";
               var temp_minn = (response.list[((i+1)*8)-1].main.temp_min - 273);
               var temp_maxx = (response.list[((i+1)*8)-1].main.temp_max - 273);
               $("#tem"+i).html((temp_minn).toFixed()+"°c"+"/"+(temp_maxx).toFixed()+"°c");  
             $(".d"+i).html(datee);
            $("#im"+i).attr('src',iconurll);
        }
    });
}
    });
}
$(".search-s").on("click",displayWeather);
//  convertTempToFarenheit
//date 
function dateBuilder(d) {
    let months = ["January","Februry","March","April","May","June","July","August","September","October","November","December"];
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return`${day} ${date} ${month} ${year}`;
  }

  function extractTime(timestamp){
      var dat = new Date(timestamp * 1000);
      var h =dat.getHours() % 12; 
      var m =dat.getMinutes();
      return ((h < 10 ? '0' + h:h)+':'+(m < 10 ? '0' + m:m));
    }