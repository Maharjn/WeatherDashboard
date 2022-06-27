const searchForm = document.getElementById('search-form');
const inputSearch = document.getElementById('input-search');
const currentDayCity = document.getElementById('current-day-city');
const currentDayTemp = document.getElementById('current-day-temp');
const currentDayWind = document.getElementById('current-day-wind');
const currentDayHumidity = document.getElementById('current-day-humidity');
let currentDayUv = document.getElementById('current-day-uv');

const apiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';

let cityName = "";

function getOneCallApi(lon, lat) {

  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(function (res) {
      return res.json()
    })

}


function getWeatherData(city) {

  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (currentWeather) {

      console.log("City Name" + currentWeather.name);
      $(currentDayCity).text(currentWeather.name);

      localStorage.setItem("cityname", currentWeather.name);

      return getOneCallApi(currentWeather.coord.lon, currentWeather.coord.lat, currentWeather.dt)
    })



}

function createWeatherDetails(userInput) {

  // localStorage.setItem("cityname",userInput);
  // send req to weatherdashboard api, 
  //buttons are created dynamically as the user enters more cities to search
  console.log("userInput" + userInput);
  // fetch weather data based on city name
  getWeatherData(userInput)
    .then(function (weatherData) {

      console.log(weatherData);

      // once we got the data,
      // populate the data into the dom
      //gets the weather icon and appends it the page


      // current 
      const datetime = moment(weatherData.current.dt, 'X').format("YYYY-MM-DD");
      console.log("datetime" + datetime);
      $(".card-deck").empty();
      var icon = weatherData.current.weather[0].icon;
      var iconImg = $("<img>");
      iconImg.addClass("img-fluid");
      iconImg.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
      var dateCurrent = $("<span>");
      dateCurrent.text(" ( " + datetime + " )");
      dateCurrent.append(iconImg);
      $(currentDayCity).append(dateCurrent);

      //if statement to update the background color of the UV Index
      var uvi = parseInt(weatherData.current.uvi);
      if (uvi <= 2) {
        $(currentDayUv).attr("class", "green");

      }
      else if (uvi >= 3 && uvi <= 5) {
        $(currentDayUv).attr("class", "yellow");

      } else if (uvi >= 6 && uvi <= 7) {
        $(currentDayUv).attr("class", "orange");
      } else if (uvi >= 8 && uvi <= 10) {
        $(currentDayUv).attr("class", "red");
      } else if (uvi >= 11) {
        $(currentDayUv).attr("class", "purple");
      }
      //currentDayCity.innerHTML = `${userInput} ${datetime}`
      //currentDayCity.innerHTML = currentCityDetail;
      currentDayHumidity.textContent = weatherData.current.humidity + "%";
      currentDayTemp.textContent = weatherData.current.temp + '° F';
      currentDayWind.textContent = weatherData.current.wind_speed + " MPH";
      $(currentDayUv).text(weatherData.current.uvi);

      $("#currentdata").css({ "display": "block" });
      //Daily Weather data for the searched City
      var daily = weatherData.daily;

      //for loop to loop through the daily response array
      for (i = 1; i < daily.length - 2; i++) {
        //saves each response in a variable
        var dailyDate = moment.unix(daily[i].dt).format("MM/DD/YYYY");
        var dailyTemp = daily[i].temp.day;
        var dailyHum = daily[i].humidity;
        var dailyIcon = daily[i].weather[0].icon;
        var dailyWind = daily[i].wind_speed;

        //creates dynamic elements
        var dailyDiv = $("<div class='card text-white bg-primary bg-gradient p-2'>")
        var pTemp = $("<p>");
        var pWind = $("<p>");
        var pHum = $("<p>");
        var imgIcon = $("<img>");
        var hDate = $("<h6>");

        //adds text and attributes to the dynamic elements
        hDate.text(dailyDate);
        imgIcon.attr("src", "https://openweathermap.org/img/wn/" + dailyIcon + "@2x.png")
        imgIcon.addClass("img-fluid");
        imgIcon.css({ "width": "100%" });
        pTemp.text("Temp: " + dailyTemp + "° F");
        pWind.text("Wind: " + dailyWind + " MPH");
        pHum.text("Humidity: " + dailyHum + "%");

        //appends the dynamic elements to the html
        dailyDiv.append(hDate);
        dailyDiv.append(imgIcon);
        dailyDiv.append(pTemp);
        dailyDiv.append(pWind)
        dailyDiv.append(pHum);
        $(".card-deck").append(dailyDiv);

        //displays this html to the user
        $("#five-day").css({ "display": "block" });
      }
      // store the city name into localstorage
      // render the history in the search list
      citySearchList();
    })
}


// when I click on the search button
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  // get user input
  const userInput = inputSearch.value;
  createWeatherDetails(userInput);


});
function citySearchList() {
  //cityName = localStorage.getItem("cityname");
  console.log("City name" + localStorage.getItem("cityname"));
  if (cityName !== null) {

    var cityList = $("<button>");
    cityList.addClass("list-group-item list-group-item-action");
    cityList.text(localStorage.getItem("cityname"));
    $("ul").prepend(cityList);
    $(inputSearch).val("");
  }
}

$("ul").on("click", "button", function () {
  cityName = $(this).text();
  console.log(cityName);

  createWeatherDetails(cityName);
})

init();

//function to display the last searched city's data
function init() {
  cityName = localStorage.getItem("cityname");
  if (cityName !== null) {

   /*  var cityList = $("<button>");
    cityList.addClass("list-group-item list-group-item-action");
    cityList.text(cityName);
    console.log(cityList.text(cityName));
    $("ul").prepend(cityList); */
    createWeatherDetails(cityName);
  }
}


