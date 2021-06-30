const axios = require('axios');
const { Translate } = require('@google-cloud/translate').v2;
const projectId = 'trans-315811';
const service = new Translate({ projectId });
service.key = 'AIzaSyB7d1S7QIn7L01wMzwxWi7PhS5Z3FroXb0'
const RU = 'ru'
const EN = 'en'

const translate = (text, language) => {
    return service.translate(text, language);
}

let question = 'what is a time series'
// Make a request for a user with a given ID
axios.get(`http://127.0.0.1:5000/?question=${question}`)
    .then(response => {
        translate(response.data, RU)
            .then(result => {
                console.log(result[0])
            })
    })
    .catch(error => {
        console.log(error);
    })

