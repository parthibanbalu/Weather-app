const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const app = express()
const hbs = require('hbs')
const port = process.env.PORT || 3000

//Define paths for Express config
const public_accessing = path.join(__dirname,'../public')
const viewspath = path.join(__dirname,'../templates/views')
const partialspath = path.join(__dirname,'../templates/partials')

//setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewspath)
hbs.registerPartials(partialspath)

//setuo static directory to serve
app.use(express.static(public_accessing))

app.get('',(req,res) => {
    res.render('index',{
        title:'Weather app',
        name: 'parthiban'
    })
})

app.get('/about',(req,res) => {
    res.render('about',{
        title: 'About the developer',
        name: 'parthiban'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
        title : 'Help page',
        name: 'parthiban'
    })
})
app.get('/weather',(req,res) =>{
    const address = req.query.address
    if(!address){
        return res.send({
            error: 'Please provide location'
        })
    }
    else {
        geocode(address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({
                    error
                })
            }
    
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({
                        error
                    })
                    
                }
                
                res.send({
                        location,
                        req_data: forecastData,
                        address: address

                })
            })
        })
    }
})
 

app.get('/product',(req,res) =>{
    if(!req.query.search){
        return res.send({
            error: 'Please send a search item'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*',(req,res) => {
    res.render('404',{
        title: '404',
        name: 'parthiban',
        error_msg: 'Help article not found'
    })
})

app.get('*',(req,res) => {
    res.render('404',{
        title: '404',
        name: 'parthiban',
        error_msg: 'Page not found'
    })
})




app.listen(port,() => {
    console.log('servers are starting up on port' +port)
})