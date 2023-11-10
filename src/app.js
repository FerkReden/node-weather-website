const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express()
const port = process.env.PORT || 3000

// Defien path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup hendelbars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to  serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Vitalii Vykh'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Vitalii Vykh',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text!',
        title: 'Help',
        name: 'Vitalii Vykh'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!',
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forcastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forcastData,
                location,
                address: req.query.address,
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term!',
        })
    }
    
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Vitalii Vykh',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
     res.render('404', {
        title: '404',
        name: 'Vitalii Vykh',
        errorMessage: 'Page not found!',
     })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})

