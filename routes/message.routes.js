const { Router } = require('express')
const router = Router()
const Message = require('../models/message')
const User = require('../models/User')

router.post('/add',
    async (req, res) => {
        try {
            const { text, userId, loginAuth } = req.body

            const message = await new Message({
                text,
                owner: userId,
                login: loginAuth,
                completed: false,
                important: false
            })

            await message.save()

            req.json(message)
        } catch (error) {
            console.log(error);
        }
    })

router.get(
    '/get',
    async (req, res) => {
        try {
            // console.log('body', req.body)
            const { userId } = req.query

            const message = await Message.find({ owner: userId}) //owner: userId

            res.json(message)

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })


module.exports = router