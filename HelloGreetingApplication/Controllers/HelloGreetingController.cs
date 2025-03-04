using Microsoft.AspNetCore.Mvc;
using ModelLayer.Model;

namespace HelloGreetingApplication.Controllers
{
    /// <summary>
    /// Class Providing API for HelloGreeting
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class HelloGreetingController : ControllerBase
    {
        private static Dictionary<string, string> greetings = new Dictionary<string, string>();

        /// <summary>
        /// Get Method to get the Greeting Message
        /// </summary>
        /// <returns>Hello, World</returns>
        [HttpGet]
        public IActionResult Get()
        {
            ResponseModel<Dictionary<string, string>> ResponseModel = new ResponseModel<Dictionary<string, string>>();

            ResponseModel.Success = true;
            ResponseModel.Message = "Hello to Greeting App API Endpoint";
            ResponseModel.Data = greetings;

            return Ok(ResponseModel);
        }

        [HttpPost]
        public IActionResult Post(RequestModel requestModel)
        {
            ResponseModel<string> ResponseModel = new ResponseModel<string>();

            greetings[requestModel.Key] = requestModel.Value;

            ResponseModel.Success = true;
            ResponseModel.Message = "Request received successfully";
            ResponseModel.Data = $"Key: {requestModel.Key}, Value: {requestModel.Value}";

            return Ok(ResponseModel);
        }

        [HttpPut]
        public IActionResult Put([FromBody] RequestModel requestModel)
        {
            ResponseModel<Dictionary<string, string>> ResponseModel = new ResponseModel<Dictionary<string, string>>();

            // Add or update the dictionary
            greetings[requestModel.Key] = requestModel.Value;

            ResponseModel.Success = true;
            ResponseModel.Message = "Greeting updated successfully";
            ResponseModel.Data = greetings;

            return Ok(ResponseModel);
        }

        [HttpPatch]
        public IActionResult Patch(RequestModel requestModel)
        {
            ResponseModel<string> ResponseModel = new ResponseModel<string>();

            if (!greetings.ContainsKey(requestModel.Key))
            {
                ResponseModel.Success = false;
                ResponseModel.Message = "Key not found";
                return NotFound(ResponseModel);
            }

            greetings[requestModel.Key] = requestModel.Value;
            ResponseModel.Success = true;
            ResponseModel.Message = "Value partially updated successfully";
            ResponseModel.Data = $"Key: {requestModel.Key}, Updated Value: {requestModel.Value}";

            return Ok(ResponseModel);
        }

        [HttpDelete("{key}")]
        public IActionResult Delete(string key)
        {
            ResponseModel<string> ResponseModel = new ResponseModel<string>();

            if (!greetings.ContainsKey(key))
            {
                ResponseModel.Success = false;
                ResponseModel.Message = "Key not found";
                return NotFound(ResponseModel);
            }

            greetings.Remove(key);
            ResponseModel.Success = true;
            ResponseModel.Message = "Entry deleted successfully";

            return Ok(ResponseModel);
        }
    }
}