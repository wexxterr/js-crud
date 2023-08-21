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
  static #list = []

  constructor(prodName, price, description) {
    this.prodName = prodName
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 1000000)
    this.createDate = () => {
      this.date = new Date().toISOString()
    }
  }

  static getList = () => this.#list

  checkId = (id) => this.id === id

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  // static updateById = (id, data) => {
  //   const product = this.getById(id)
  // }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = this.getById(id)
    const { prodName } = data;

    if (product) {
      if (prodName) {
        product.prodName = prodName
      }

      return true
    } else {
      return false
    }
  }

  static update = (prodName, { product }) => {
    if (prodName) {
      product.prodName = prodName
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

  res.render('alert', {
    style: 'alert',
    info: result ? 'Email пошта оновлена' : 'Виникла помилка',
    link: 'user-update'
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { prodName, price, description } = req.body

  const product = new Product(prodName, price, description)

  Product.add(product)

  console.log(Product.getList())

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: 'Товар успішно додано',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()

  console.log(list)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку

  const { id } = req.query

  const product = Product.getById(Number(id))

  // console.log(product)

  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('product-edit', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-edit',

      data: {
        prodName: product.prodName,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Продукту за таким ID не знайдено',
      link: '/product-edit  ',
    })
  }
})
// ↑↑ сюди вводимо JSON дані

// ================================================================

router.post('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id, prodName, price, description } = req.body

  const product = Product.updateById(Number(id), {
    prodName,
    price,
    description,
  })

  console.log(id)
  console.log(product)

  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Інформація про товар оновлена',
    })
  } else {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Сталася помилка',
      link: '/product-edit',
    })
  }
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-delete', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query

  Product.deleteById(Number(id))

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: 'Товар видалений',
    link: '/product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

// Підключаємо роутер до бек-енду
module.exports = router