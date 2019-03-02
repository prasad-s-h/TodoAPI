
// const {SHA256} = require('crypto-js');
// const jwt = require('jsonwebtoken');

// let message = 'toBeCrypted';
// let message1 = {
//     data: 5
// };

// let cryptedMessage1 = SHA256(message).toString();
// console.log(cryptedMessage1);

// let cryptedMessage2 = SHA256(message).toString();
// console.log(cryptedMessage2);

// if(cryptedMessage1 === cryptedMessage2){
//     console.log('equal');
// }else{
//     console.log('not equal');
// }

// let token1 = jwt.sign(message1, 'secretKey');
// console.log(token1);

// let token2 = jwt.sign(message1, 'secretKey');
// console.log(token2);

// if(token1 === token2){
//     console.log('tokens are equal');
// }else {
//     console.log('tokens are not equal');
// }

// let decoded1 = jwt.verify(token1, 'secretKey');
// let decoded2 = jwt.verify(token2, 'secretKey');

// console.log(decoded1);
// console.log(decoded1);

// if(decoded1 === decoded2){
//     console.log('decoded tokens are equal');
// }else {
//     console.log('decoded tokens are not equal');
// }


const bcrypt = require('bcryptjs');
let password = 'prasad123';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log('hashed = ', hash);
//     });
// });

let hashed = '$2a$10$knlQTe7H6VPVSR811lD6L.K96P1hrllc8OD4LCUOQMif7epXqMTgq';
// let hashed = '$2a$10$iUPcQ0aduMq8pVwFRWwqSONe/o5ZXpPWfifALUMY/pxLDzfM1kiiK';
// let hashed = '$2a$10$pW9yJPObtGv1O3tCrb00CedP6yS0BvcGMvGhcQa6rpi/TrK6ehzOm';
// let hashed = '$2a$10$AJ4RoDbvwBDg0SQ8/1EZtezLL0XChmSlIbjQ9mAmx353mXONyOKFm';

bcrypt.compare(password, hashed, (err, res) => {
    console.log(res);
});
