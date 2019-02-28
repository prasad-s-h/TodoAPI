
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let message = 'toBeCrypted';
let message1 = {
    data: 5
};

let cryptedMessage1 = SHA256(message).toString();
console.log(cryptedMessage1);

let cryptedMessage2 = SHA256(message).toString();
console.log(cryptedMessage2);

if(cryptedMessage1 === cryptedMessage2){
    console.log('equal');
}else{
    console.log('not equal');
}

let token1 = jwt.sign(message1, 'secretKey');
console.log(token1);

let token2 = jwt.sign(message1, 'secretKey');
console.log(token2);

if(token1 === token2){
    console.log('tokens are equal');
}else {
    console.log('tokens are not equal');
}

let decoded1 = jwt.verify(token1, 'secretKey');
let decoded2 = jwt.verify(token2, 'secretKey');

console.log(decoded1);
console.log(decoded1);

if(decoded1 === decoded2){
    console.log('decoded tokens are equal');
}else {
    console.log('decoded tokens are not equal');
}
