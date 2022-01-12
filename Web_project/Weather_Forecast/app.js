var $ = document.querySelector.bind(document);

var search = $(".search");
var city = $(".city");
var country = $(".country");
var time = $(".time");
var temperature = $(".temperature .value");
var shortDesc = $(".short-description");
var visibility = $(".visibility span");
var wind = $(".wind span");
var feather = $(".feather span");
var content = $(".content");
var body = $("body");
async function changeWeatherUI() {
    let find = search.value.trim();
    //Nhớ thêm https:// vô đầu api
    let apiWeather = `https://api.openweathermap.org/data/2.5/weather?q=${find}&appid=bf10fe2f7e85afc94ffd39a665438f79`

    let data = await fetch(apiWeather).then(response => response.json())

    if (data.cod == 200) {
        content.classList.remove("hide");
        city.innerHTML = data.name;
        country.innerHTML = data.sys.country;
        var myDate = new Date();
        time.innerHTML = `${myDate.getDate()}/${myDate.getMonth() + 1}/${myDate.getFullYear()}, ${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()} ${myDate.getHours() >= 12 ? "PM" : "AM"}`;
        var celsious = Math.round(data.main.temp - 273.15)
        temperature.innerHTML = celsious + `<sup>o</sup>C`;
        shortDesc.innerHTML = data.weather[0].main
        visibility.innerHTML = data.visibility + "m"
        wind.innerHTML = data.wind.speed + "m/s"
        feather.innerHTML = data.main.humidity + "%"

        if (celsious <= 0)
            body.setAttribute("class", "t-0");
        else if (0 < celsious && celsious <= 10)
            body.setAttribute("class", "t-10");
        else if (10 < celsious && celsious <= 20)
            body.setAttribute("class", "t-20");
        else if (20 < celsious && celsious <= 30)
            body.setAttribute("class", "t-30");
        else if(30 < celsious && celsious <= 40)
            body.setAttribute("class", "t-40");
        else
            body.setAttribute("class", "t-50");
    }
    else {
        content.classList.add("hide");
    }
}

search.onchange = function (event) {
    changeWeatherUI();
}



