// Подключение библиотек
const fetch = require('node-fetch');
const config = require('./config.json');
const mqtt = require('mqtt');
const api = require('./weatherapi.json');

// Присоединяемся по mqtt протоколу к брокеру ably и сохраняем её в переменную 
var client  = mqtt.connect('mqtt://test.mosquitto.org')

// При коннекте подписываемся на токен погоды
client.on('connect', (options) => {
  client.subscribe(`${config.token}/weather`, (err) => {
    if (err) {
      console.error(err);
    }
  });

  console.log('Connected successfully');
});

// Формируем сообщение
client.on('message', async (city) => {
  const weather = await getWeather(city);

  console.log(weather)
  var options={
    retain:true,
    qos:1,
  };
    client.publish("task12345", JSON.stringify(weather) ,options)
});

// Асинхронная функция которая делает запрос на api погоды
async function getWeather(city) {
  const url = `${api.url}?q=${city || api.city}&appid=${api.apiKey}&units=${
    api.units
  }`;
 
  const response = await (await fetch(url)).json();
  return response;
  
};

// Эмитируем сообщение с городом Днипро
client.emit('message', 'Dnipro');



