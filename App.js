const express = require('express') //Подключаем experess
const config = require('config')  //Подключаем config
const mongoose = require('mongoose') //Подключаем mongoose


const app = express()

app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port') || 5000

async function start(){
    try{
        await mongoose.connect(config.get('MongoUrl'), { //Подключение к базе данных

        }) 
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`)) //Ответ от сервера при удачном подключении к бд
    } catch(e){
        console.log('Server Error', e.message)
        process.exit(1)
    }

}

start()
