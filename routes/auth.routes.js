//Файл routes, который отвечает за авторизацию, валидацию и регистрацию пользователя

const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/get

router.get('/get', async (req, res) => { //Проверка работы сервера
  try {
    const { userId } = req.query

    const user = await User.find({ userId })

    res.json(user)
  } catch (error) {
    console.log(error)

  }
})

// /api/auth/register

router.post(
  '/register',
  [
    check('login', 'Некорректный login').isLength({ min: 3 }),
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 3 })
  ],
  async (req, res) => {
    try {
      // console.log('Body:', req.body) Проверка входных данных с body

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации'
        })
      }

      const { login, email, password } = req.body

      const candidate = await User.findOne({ email })
      const candidate2 = await User.findOne({ login })

      if (candidate || candidate2) {
        return res.status(400).json({ message: 'Такой пользователь уже существует' })
      }


      const user = new User({ login, email, password })
      await user.save()

      res.status(201).json({ message: 'Пользователь создан' })

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })


// /api/auth/login
router.post(
  '/login',
  [
    check('loginAuth', 'Введите корректный login').trim().notEmpty(),
    check('passwordAuth', 'Введите пароль').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при входе в систему'
        })
      }

      const { loginAuth, passwordAuth } = req.body

      const user = await User.collection.find({ "login": loginAuth, "password": passwordAuth }).count()
      if (user == 0) {
        return res.status(400).json({ message: 'Не верный логин или пароль' })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' },
      )

      res.json({ token, userId: user.id, loginAuth })

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })

  router.delete(
    '/delete/:id',
    async (req, res) => {
        try {
            const user = await User.findOneAndDelete({_id: req.params.id})
            res.json(user)
        } catch (error) {
            console.log(error)
        }
    }
)

module.exports = router