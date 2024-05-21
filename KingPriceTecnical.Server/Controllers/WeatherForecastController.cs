using KingPriceTecnical.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace KingPriceTecnical.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, HttpClient httpClient, IConfiguration configuration)
        {
            _logger = logger;
            _httpClient = httpClient;
            _apiKey = configuration["Weather_API_KEY"];
        }
        [HttpGet(Name = "GetWeatherForecast")]
        public async Task<IActionResult> Get(string city)
        {
            string url = $"http://api.weatherapi.com/v1/current.json?key={_apiKey}&q={city}&aqi=no";

            HttpResponseMessage response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                string jsonResponse = await response.Content.ReadAsStringAsync();
                var weatherData = JsonConvert.DeserializeObject<WeatherResponse>(jsonResponse);
                return Ok(weatherData);
            }
            else
            {
                _logger.LogError("Failed to retrieve weather data for {City}", city);
                return StatusCode((int)response.StatusCode, "Failed to retrieve weather data.");
            }
        }
    }
}
