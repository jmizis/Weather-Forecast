var searchButton = document.querySelector("#searchBtn")


searchButton.addEventListener("click", function(event){
event.preventDefault()
   console.log ("search")
   // This will clear out the current city forecast when you search a new one so it won't show multiple cities at once.
   $("#currentWeather").empty()
   $("#forecast").empty()
    var searchValue = document.getElementById ("search-input").value
    console.log(searchValue)
    geoCode(searchValue)
    historyBtn(searchValue)
}) 

// Creating local storage to save the cities
var cityArray= JSON.parse(localStorage.getItem("cities"))||[]
// This creates list of searched cities you viewed and will show on the page one at a time.
function historyBtn(searchValue){
  var btn = $("<li>").addClass("list-group-item").text(searchValue)
  $("#searchHistory").append(btn)
}
for (var i =0; i<cityArray.length;i++){
  historyBtn(cityArray[i])
}
// This takes the city value from search input using latitude and longitude for location.
function geoCode(searchValue){
  cityArray.push(searchValue)
  localStorage.setItem("cities",JSON.stringify(cityArray))
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=366fd2554befabfba698a6df5073c21e`
   
    fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      citySearch(data[0].lat,data[0].lon)
      forecast(data[0].lat,data[0].lon)

     
      
    })
    
}






  

// Will give you the hourly weather forecast for the city search.
function citySearch(lat,lon){
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=366fd2554befabfba698a6df5073c21e&units=imperial` 
   
    fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      // Creates the weather card to display the current temp, wind, humidity which im pulling from the object in my console. 
      var weatherCard = $("<div>").addClass("card")
var currentTemp = $("<h2>").text("Temp: "+data.main.temp + "°F")
var wind = $("<h3>").text("Wind: "+data.wind.speed+ "MPH")
var humidity = $("<h4>").text("Humidity: "+data.main.humidity+ "%")



weatherCard.append(currentTemp,wind,humidity)
      $("#currentWeather").append(weatherCard)
    })
    
}


// Creates the weather forecast for the next five day and displays them. 
function forecast(lat,lon){
  var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=5day&appid=366fd2554befabfba698a6df5073c21e&units=imperial`
  
 fetch(requestUrl)
 .then(function(response) {
  return response.json()
 })
  
 .then (function(data){
  console.log(data)
  // Foreloop created for the five day forecast. API is calling weather forecast for every three hours so im starting on the fifth index midday and selecting eight index's from the fifth which equals 24 hours from the time selected. 
   for (var i = 5; i < data.list.length; i=i+8) {

  var fiveday = $("<div>").addClass("card")
  var date = $("<h4>").text(moment.unix(data.list[i].dt).format("MM/DD/YY"))
   var temp = $("<h5>").text("Temp: " + data.list[i].main.temp_max + " °F");
   var wind = $("<h6>").text("Wind: "+data.list[i].wind.speed + " MPH");
 var humidity = $("<h6>").text("Humidity: " + data.list[i].main.humidity + "%");




fiveday.append(date,temp,wind,humidity)
 $("#forecast").append(fiveday)
 }
 })

  
}











