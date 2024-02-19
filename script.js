$(document).ready(function(){
  
 
const key="13728a7a0f3ce5d28d4a06b074a6b13e"
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
let cityInput=$("#city")
let history=$("#history")
let results=$("#results")
let cities = JSON.parse(localStorage.getItem('cities')) || [];
// console.log("city1=")
$("button").click(function(){
    let cityValue=cityInput.val().trim().toUpperCase()
    cityInput.val("")
    // console.log("cityValue",cityValue)
    renderButton(cityValue,true)
    // let url="https://api.openweathermap.org/data/2.5/weather?q="+cityValue+"&appid="+key
   getWeatherByCity(cityValue)
  });

function getWeatherByCity(cityValue){
  let url = "https://api.openweathermap.org/geo/1.0/direct?q="+cityValue+"&limit="+1+"&appid="+key
  // console.log(url)
  $.get(url).then(function (data){
      // console.log("Data: " + data[0].lat);
      const cood = {
        lat: data[0].lat,
        lon: data[0].lon,
        city: cityValue
      }
      return cood
    }).then(function(cood){
      console.log("I am inside the button click",cood)
      getWeather(cood)
    })
}

  function renderButton(city,isClicked){
    history.empty()
    let cities_ = JSON.stringify(cities)
    if(isClicked && city.length > 3 && !cities_.includes(city)){
      cities.push(city)
      cities.length = cities.length > 10 ? 10 : cities.length;
      localStorage.setItem('cities', JSON.stringify(cities));
    }
     
      // console.log("city history",city)
      $.each(cities, function (i, city) {
        // console.log("city",city)
        let cityBtn = $('<button class="cities">');
        cityBtn.text(city);
        cityBtn.on('click', function () {
           
                getWeatherByCity(city);
                console.log("city",city)
            
        });

        history.append(cityBtn);
      });
  }

  function getWeather(cood){
    let arr=[]
    console.log("getWeather")
    const currentUrl="https://api.openweathermap.org/data/2.5/weather?lat="+cood.lat+"&lon="+cood.lon+"&appid="+key
    $.get(currentUrl).then(function(data){
      console.log("data.main.tempature", data.main.temp)

      // let date = new Date(data.dt * 1000)
      let date = new Date().toString()
      let tempature = (data.main.temp - 273.15) * 1.8 + 32
      currentData={
        cityname:cood.city,
        date:date,
        icon:data.weather[0].icon,
        tempature:Math.round(tempature),
        humidity:data.main.humidity,
        windspeed:data.wind.speed
      }
      return currentData
    }).then(function(currentData){
      // console.log("currentData", currentData)
      let weatherData={}
      console.log("I could be anything",cood)
      const url="https://api.openweathermap.org/data/2.5/forecast?lat="+cood.lat+"&lon="+cood.lon+"&appid="+key
      $.get(url).then(function (data){
        for(let i in data.list){
          if((Number(i)+1)%8==0){
            // console.log("x",x)
            weatherData={
              cityname:cood.city,
              date:data.list[i].dt_txt,
              icon:data.list[i].weather[0].icon,
              tempature:data.list[i].main.temp,
              humidity:data.list[i].main.humidity,
              windspeed:data.list[i].wind.speed
            }
            arr.push(weatherData)
          }
        }
        arr.push(currentData)
        return arr
      }).then(function(arr){
        renderWeather(arr)
      })
    })
   
  }
  function renderWeather(data){
    results.empty()
    let resultsCon = $('<div class="daily">');
    console.log("renderWeather",data)

    //start of current weather
    let current = data[5]
    // console.log("current",current)

    let currentCard = $('<div class="current-card">');
    results.append(currentCard)

    let currentCityName= $('<h3>').text(current.cityname)
    currentCard.append(currentCityName)

    console.log("current",current)
    let date1 = current.date;
    let date2 = date1.substring(0,11)
    let currentHour= $('<h3>').text(date2)
    currentCard.append(currentHour)

    let currentImg = current.icon;
    let currentIcon = $('<img id="current-image">').attr('src', 'http://openweathermap.org/img/wn/' + currentImg + '@2x.png');
    currentCard.append(currentIcon);

    let currentTemp = $('<p>').html('Temp: <span>' + current.tempature + '&#8457;</span>');
    currentCard.append(currentTemp);

    let currentHumidity = $('<p>').html('Humidity: <span>' + current.humidity + '</span>');
    currentCard.append(currentHumidity);

    let currentWindSpeed = $('<p>').html('Wind speed: <span>' + current.windspeed + '</span>');
    currentCard.append(currentWindSpeed);
    //end of current weather

    for(let i in data){
      if(i < 5 ){
      let weatherCard= $('<div class="weather-card">');
      results.append(weatherCard)

      console.log("forloop", typeof(data[i].date))
      let date4 = data[i].date
      let date5 = date4.substring(0,10)
      let weatherHour= $('<h3>').text(date5)
      weatherCard.append(weatherHour)

      let weatherImg = data[i].icon;
      let weatherIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + weatherImg + '@2x.png');
      weatherCard.append(weatherIcon);

      let F = (data[i].tempature - 273.15) * 1.8 + 32
      let temp = $('<p>').html('Temp: <span>' + Math.round(F) + '&#8457;</span>');
      weatherCard.append(temp);

      let humidity = $('<p>').html('Humidity: <span>' + Math.round(data[i].humidity) + '</span>');
      weatherCard.append(humidity);

      let windSpeed = $('<p>').html('Wind speed: <span>' + Math.round(data[i].windspeed) + '</span>');
      weatherCard.append(windSpeed);
    }}
  }
  renderButton("city",false)
});