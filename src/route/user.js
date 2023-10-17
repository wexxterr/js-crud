
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