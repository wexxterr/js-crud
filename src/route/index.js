// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

class Track {

  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById = (id) => {
    return this.#list.find((track) => track.id === id)
  }
}

Track.create(
  '美少女無罪♡パイレーツ',
  '宝鐘マリン',
  'https://i.scdn.co/image/ab67616d0000b273ad7a27fdc6b15c24bb12a1d1',
)

Track.create(
  '勇者',
  'YOASOBI',
  'https://i.scdn.co/image/ab67616d0000b273a9f9b6f07b43009f5b0216dc',
)

Track.create(
  'CRAZY NOISY BIZZARE TOWN',
  'THE DU',
  'https://i.scdn.co/image/ab67616d0000b2739d956d70e6b09cd3452f4a59',
)

Track.create(
  'MUKANJYO',
  'Survive Said The Prophet',
  'https://i.scdn.co/image/ab67616d0000b27366692ec3a0f5437132315850',
)

Track.create(
  'Ambiguous',
  'GARNiDELiA',
  'https://i.scdn.co/image/ab67616d0000b2738b39373afe41803b83e4fa44',
)

Track.create(
  'サクリファイス',
  '9mm Parabellum Bullet',
  'https://i.scdn.co/image/ab67616d0000b273035b5e090310fa10b00709d5',
)

Track.create(
  'インフェルノ',
  '9mm Parabellum Bullet',
  'https://i.scdn.co/image/ab67616d0000b2732d5f2b2b0a1314b0120292c3',
)

console.log(Track.getList())

class Playlist {

  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/164/164'
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track(id) !== trackId,
    )
  }
}

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get(
  '/'
  // 'spotify-choose'
  , function (req, res) {
    // res.render генерує нам HTML сторінку

    res.render('spotify-choose', {

      style: 'spotify-choose',

      data: {},
    })
  })

// ↙️ тут вводимо шлях (PATH) до сторінки
// router.get('/', function (req, res) {
//   // res.render генерує нам HTML сторінку

//   res.render('spotify-my-lib', {

//     style: 'spotify-my-lib',

//     data: {},
//   })
// })

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-create', function (req, res) {

  const isMix = !!req.query.isMix

  console.log(isMix)

  res.render('spotify-create', {

    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/spotify-create', function (req, res) {
  console.log(req.body, req.query)

  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
      image: playlist.image,
    },
  })
})

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('spotify-playlist', {
      style: 'spotify-playlist',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: '/',
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-playlist-add', function (req, res) {
  const id = Number(req.playlistId)

  const playlist = Playlist.getById(id)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router