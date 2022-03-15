const express = require('express')

const router = express.Router()
const dbUtils = require('../lib/db')

router.get('/', (req, res) => {
  const db = dbUtils.get('drink_type')

  db.search().then((drinkType) => {
    res.render('drinkType', {
      drinkType,
    })
  }).catch((err) => {
    res.status(500).send({ error: err })
  })
})

router.get('/new', (req, res) => {
  res.render('drinkType/new')
})

router.post('/new', (req, res) => {
  const db = dbUtils.get('drink_type')

  const drinkType = {
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    height: req.body.height,
    diameter: req.body.diameter,
    volume: req.body.volume,
  }

  db.create(drinkType).then(() => {
    res.redirect('/drink-type')
  }).catch((err) => {
    res.status(500).send({ error: err })
  })
})

router.get('/:id/delete', (req, res) => {
  const db = dbUtils.get('drink_type')

  db.delete(req.params.id).then(() => {
    res.redirect('/drink-type')
  }).catch((err) => {
    res.status(500).send({ error: err })
  })
})

router.get('/:id/edit', (req, res) => {
  const db = dbUtils.get('drink_type')

  db.read(req.params.id).then((drinkType) => {
    res.render('drinkType/edit', drinkType)
  }).catch((err) => {
    res.status(500).send({ error: err })
  })
})

router.post('/:id/edit', (req, res) => {
  const db = dbUtils.get('drink_type')

  const drinkType = {
    id: req.params.id,
    /*eslint-disable */
    _rev: req.body._rev,
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    height: req.body.height,
    diameter: req.body.diameter,
    volume: req.body.volume,
  }

  db.update(drinkType.id, drinkType).then(() => {
    res.redirect('/drink-type')
  }).catch((err) => {
    res.status(500).send({ error: err })
  })
})

module.exports = router
