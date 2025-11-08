let baseUrl = 'https://api-m.sandbox.paypal.com';
const base64 = require('base-64');
 
let clientId = 'AWTahHgZfjKxXqTjAau2a5Hgk80Zq9U0qPLPqrgYyWV5yvMV5__GxL6xgqqPMWIez57NBOXPfu8WM3H_';
let secretKey = 'EOp6gnNVcC5bqkKmR8S3lf7sF7lqPcvJ_00ou1Ga3l4ls4cYWyIBivLEy4fI1zC2gtXAhwBqoRylzkR7';


const generateToken = () => {
    var headers = new Headers()
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic " + base64.encode(`${clientId}:${secretKey}`));

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials',
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v1/oauth2/token', requestOptions).then(response => response.text()).then(result => {
            // console.log("result print", result)
            const { access_token } = JSON.parse(result)
            resolve(access_token)
        }).catch(error => {
            // console.log("error raised", error)
            reject(error)
        })
    })
}

const createOrder = (token = '',orderDetail) => {

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify(orderDetail)
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v2/checkout/orders', requestOptions).then(response => response.text()).then(result => {
            // console.log("result print", result)
            const res = JSON.parse(result)
            resolve(res)
        }).catch(error => {
            // console.log("error raised", error)
            reject(error)
        })
    })
}

const capturePayment = (id, token = '') => {
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + `/v2/checkout/orders/${id}/capture`, requestOptions).then(response => response.text()).then(result => {
            // console.log("result print", result)
            const res = JSON.parse(result)
            resolve(res)
        }).catch(error => {
            // console.log("error raised", error)
            reject(error)
        })
    })
}







export default {
    generateToken,
    createOrder,
    capturePayment
}