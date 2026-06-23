const crypto = require('crypto');
const argon2 = require('argon2');

//GENERATE A UNIQUE ID FOR TABLE ITEM
const GenerateUniqueId = () => {
        return crypto.randomUUID();
};

//HASH THE PASSWORD WHEN CREATING THE ACCOUNT
const passHash = async (password) => {
    return await argon2.hash(password);
};

//CHECK PASSWORD
const loginCheck = async (password, user) => {
    return await argon2.verify(user.password, password);
};


module.exports = {GenerateUniqueId, passHash, loginCheck}