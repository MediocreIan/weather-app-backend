require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const axios = require('axios');
const https = require('https');
const fetch = require("node-fetch");




const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());


app.get('/lat=:lat&lng=:lng', (req, res) => 
{
  getWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${req.params.lat}&lon=${req.params.lng}&appid=${process.env.API_KEY}&units=imperial`).then((data) =>
  {
    res.send(data)
  })
})

app.get('/sevenDay/lat=:lat&lng=:lng', (req, res) => 
{
  console.log(process.env.API_KEY)
  getWeather(`https://api.openweathermap.org/data/2.5/onecall?lat=${req.params.lat}&lon=${req.params.lng}&exclude=current,minutely,hourly,alerts&appid=${process.env.API_KEY}&units=imperial`).then((data) =>
  {
    res.send(data)
  })
})

app.get('/search/q=:query', (req, res) => 
{
  getWeather(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.query}&appid=${process.env.API_KEY}&units=imperial`).then((data) =>
  {
    res.send(data)
  })
})

async function getWeather(url)
{
  console.log(url)
  let result = ''
  try
  {
    const response = await fetch(url);
    const json = await response.json();
    result = json
  } catch (error)
  {
    console.error(error);
  }

  return result
}


app.use(function errorHandler(error, req, res, next)
{
  let response;
  if (NODE_ENV === "production")
  {
    response = { error: { message: "server error" } };
  } else
  {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
