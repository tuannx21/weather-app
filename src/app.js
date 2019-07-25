const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, '../views/partials'))

app.get('', (req, res) => {
  res.render('index', {
    title: req.query.title,
    body: req.query.body
  })
})

app.get('/weather', (req, res) => {
  const address = req.query.address
  if (!address) res.send({ error: 'pls enter address' })
  else {
    geocode(address, (error, data) => {
      if (error) {
        return console.log(error)
      }

      forecast(data.latitude, data.longitude, (error, forecastData) => {
        if (error) {
          res.send({ error: 'something wrong' })
          return
        }

        res.send({
          location: data.location,
          forecast: forecastData
        })
      })
    })
  }
})

app.listen(port, () => {
  console.log('server on 3000')
})
