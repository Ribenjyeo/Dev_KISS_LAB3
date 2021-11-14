//Файл routes, который отвечает за авторизацию, валидацию и регистрацию пользователя

const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register

router.get('/get', (req, res) => { //Проверка работы сервера
    res.send('Hello World!');
})

router.post(
    '/register',
    [
      check('login', 'Некорректный login').isLength({min:3}),   
      check('email', 'Некорректный email').isEmail(),
      check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
      const errors = validationResult(req)
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации'
        })
      }
  
      const {login, email, password} = req.body
  
      const candidate = await User.findOne({ email })
  
      if (candidate) {
        return res.status(400).json({ message: 'Такой пользователь уже существует' })
      }
  
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({login, email, password: hashedPassword })
  
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
        check('login', 'Введите логин').exists(),
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
     async(req, res) => {
    try {
        const errors = validationResult(req)

        if(errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }

        const {login, email, password} = req.body
        const user = await User.findOne({login})

        if(!user){
            return res.status(400).json({message: 'Пользователь не найден'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: 'Не верный пароль'})
        }

        const token = jwt.sign(
            {userId: user.id}, 
            config.get('jwtSecret'),
            {expiresIn: '1h'} //черещ сколько Jwt token закончит свое существование
        )

        res.json({token, userId: user.id})

    } catch (e) {
        res.status(500).json(e.message) //Http ошибка №5000
    }
})

module.exports = router