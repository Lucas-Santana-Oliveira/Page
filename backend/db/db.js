const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect("mongodb+srv://lucassantanapgsp:tapRLGdqkSsizipQ@cluster0.lapeewa.mongodb.net/?retryWrites=true&w=majority")
        console.log('Conectado')
    } catch (error) {
        console.log('Conectado Error');
    }
}

module.exports = connectDB
