import axios from "axios";

const creatPaymentIntent = (data) => {
    return new Promise((resolve, reject) => {
        axios.post('http://elitesewa-api.indiasellers.com/payment-sheet', data).then(function (res) {
            resolve(res)
        }).catch(function (error) {
            reject(error)
        })
    })
}

export default creatPaymentIntent