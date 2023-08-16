// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================


class User {
  static #list = [];

  constructor(email, login, password) {
    this.email = email;
    this.login = login;
    this.password = password;
    this.id = new Date().getTime()
  }

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) => this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex((user) => user.id === id,)

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id);

    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

class Product {

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description

    this.id = Math.floor(10000 + Math.random() * 90000);
    this.createDate = new Date().toISOString();
  }

  static #list = []

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) => this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id);

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex((product) => product.id === id,)

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()
  res.render('index', {
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0
      }
    }
  })
})

// ================================================================

router.post('/user-create', function (req, res) {

  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений'
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {

  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений'
  })
})

// ================================================================

router.post('/user-update', function (req, res) {

  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))
  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result ? 'Email пошта оновлена' : 'Виникла помилка'
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()
  res.render('product-create', {
    style: 'product-create',

    data: {
      products: {
        list,
        isEmpty: list.length === 0
      }
    }
  })
})

// ================================================================

router.post('/product-create', function (req, res) {

  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(User.getList())

  res.render('product-info', {
    style: 'product-info',
    info: 'Товар створений'
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()
  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0
      }
    }
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
