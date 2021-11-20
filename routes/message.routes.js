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

            const message = await Message.find({ owner: userId }) //owner: userId
            res.json(message.reverse())

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

router.delete(
    '/delete/:id',
    async (req, res) => {
        try {
            const message = await Message.findOneAndDelete({ _id: req.params.id })
            res.json(message)
        } catch (error) {
            console.log(error)
        }
    }
)

router.patch(
    '/like/:id',
    async (req, res) => {
        try {
            const { id } = req.params;

            const post = await Message.findById(id);

            const updatedPost = await Message.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 });

            res.json(updatedPost);
        } catch (error) {
            console.log(error)
        }
    }
)

router.patch(
    '/edit/:id/:text',
    async (req, res) => {
        try {
            const { id } = req.params;

            const post = await Message.findById(id);
            console.log(req.params)
            const updatedPost = await Message.findByIdAndUpdate(id, { text: post.text = req.params.text });

            res.json(updatedPost);
        } catch (error) {
            console.log(error)
        }
    }
)

module.exports = router