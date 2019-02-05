const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$s/pbzyezh3Iww3miR2l1mOeRkvP16fzcW/828W4aTLmNiDguH03La';

bcrypt.compare(password,hashedPassword,(err,res)=>{
    console.log(res);
});