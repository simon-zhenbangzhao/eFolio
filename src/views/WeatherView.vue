<script>
// The info section in 10.1.1 provided detailed information about this package 
import axios from "axios";

const apikey = "2b43fd9c07a1bf0a2da056e3c949ce88";

export default {
  name: "App",
  data() {
    return {
      city: "",
      weatherData: null,
      hourlyForecast: [],
      dailyForecast: [],
      errorMessage: null,
    };
  },
  //computed is a property that is used to define a property that 
  //is dependent on other data properties. 
  //If we using a more easy to understand words to understand the concept: 
  //the derived value such as temperature automatically update when the relevant value change.
  computed: {
    //There are multiple way to obtain the data in Celsius format.
    //Calculation by yourself like below after data is retireved or via API parameters
    
    //Example of adding additional units requirement, if you choose this, remember to change section 3.1
    //https://api.openweathermap.org/data/2.5/weather?lat=XXX&lon=-XXX.15&appid={API key}&units=metric
    temperature() {
      return this.weatherData
        ? Math.floor(this.weatherData.main.temp - 273)
        : null;
    },
    //Get the current weather icon using the API link
    iconUrl() {
      return this.weatherData
        ? `https://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
        : null;
    },
  },
  //There are two steps involved in this, 
  //step 1: identify current location 
  //step 2: after identify, get the weather data straight based on the current location.
  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {
    //Async in a easy to understand way means the method will run in backend thread, 
    //And it won't occupy the main thread, so the user experience is still smooth
    async fetchCurrentLocationWeather() {
      //The navigator.geolocation object is part of the Web API provided by modern web browsers
      //Please note this function is not belongs to Vue or openweather.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          //API link to obtain the current weather based on the current location browser identified 
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
          //await means wait for the fetchWeatherData method to complete before proceeding
          await this.fetchWeatherData(url);
        });
      }
    },
    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url);
        //Returned data from API is stored as JSON file in weatherData
        this.weatherData = response.data;
        this.errorMessage = null;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        if (error.response && error.response.status === 401) {
          this.errorMessage = "API Key 无效或未激活。请前往 OpenWeatherMap 注册并获取有效的 API Key。新 API Key 需要等待 10 分钟到 2 小时激活。";
        } else {
          this.errorMessage = "无法获取天气数据。请检查网络连接或稍后再试。";
        }
        this.weatherData = null;
      }
    },
    async searchByCity() {
      if (this.city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}`;
        await this.fetchWeatherData(url);
      }
    }
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Weather Check</h1>
        
        <div class="text-center mt-4">
          <input 
            type="text" 
            v-model="city" 
            placeholder="Enter city name" 
            class="form-control mb-3"
          />
          <button class="btn btn-primary" @click="searchByCity">Search</button>
        </div>

        <!--The <main> tag in HTML is used to specify the main content of a document 
        More info about main, check https://www.w3schools.com/tags/tag_main.asp-->  
        <main class="mt-4">
          <!--Display error message if there is an error-->
          <div v-if="errorMessage" class="alert alert-danger text-center">
            {{ errorMessage }}
          </div>
          <!--If there are no data returned, then skip rendering the information-->  
          <div v-if="weatherData" class="text-center">
            <!--Display the weather data attribute returned from API
            Example of API data: https://openweathermap.org/current-->  
            <h2>
                {{ weatherData.name }}, {{ weatherData.sys.country }}
            </h2>
            <div>
              <!--The image source of of the weather icon will be coming from a function called iconUrl
                  which will be shared in script later-->  
              <img :src="iconUrl" alt="Weather Icon" />
              <p>{{ temperature }} °C</p>
            </div>
            <!-- weather[0] means the current weather, the way we need to obtain data depends on how
            the API JSON data looks-->
            <span>{{ weatherData.weather[0].description }}</span>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

