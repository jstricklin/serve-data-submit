const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Papa = require('papaparse')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000

if (process.env.NODE_ENV === "development") app.use(morgan('dev'))
app.use(morgan('combined'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const csvPath = path.join(__dirname, 'db', 'instructors.csv')
const csv = fs.readFileSync(csvPath, 'utf8')
const options = { header: true, skipEmptyLines: true, dynamicTyping: true }
const data = Papa.parse(csv, options)

app.get('/', (req, res, next)=>{
    res.send({'instructors':data.data})
})

app.get('/:id', (req, res, next)=>{
    let id = req.params.id
    let result = data.data.filter(instructor => instructor.ID == id)
    if (result.length === 0) {
        next({'status':500, 'error':"No matching ID found"})
    } else {
    res.send({'instructor':result[0]})
    }
})
app.use((err, req, res, next)=>{
    res.status(err.status).send({"error":err.error})
})
app.use((req, res)=>{
    res.status(500).send({'error': "Nothing here. Huh."})
})
const listener = ()=> console.log(`Rockin hard on port ${port}`)

app.listen(port, listener)
