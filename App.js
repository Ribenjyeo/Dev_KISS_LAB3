const express = require('express') //Подключаем experess
const config = require('config')  //Подключаем config
const mongoose = require('mongoose') //Подключаем mongoose


const app = express()

app.use(express.json({ extended: true}))//Middlware для Json 

app.use('/api/auth', require('./routes/auth.routes')) //работа с пользователем

app.use('/api/message', require('./routes/message.routes')) //работа с сообщениями

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
