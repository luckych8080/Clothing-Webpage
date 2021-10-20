const { checkSchema } = require('express-validator');

// module.exports.productSchema = checkSchema({
//     product: checkSchema({
//         title:{ 
//             isString: true,
//             exists: true},
//         price: {
//             exists: true,
//             iisInt: true},
//         location: {
//             isString: true,
//             exists: true},
//         description: {
//             isString: true,
//             exists: true},
//     })
// })