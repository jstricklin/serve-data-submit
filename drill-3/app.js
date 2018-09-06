const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Papa = require('papaparse')
const cors = require('cors')
const morgan = require('morgan')
const port = process.env.PORT || 3000
const fs = require('fs')
const path = require('path')

const csvPath = path.join(__dirname, 'db', 'students.csv')
const csv = fs.readFileSync(csvPath, 'utf8')
const options = {header: true, dynamicTyping: true}
const {data} = Papa.parse(csv, options)

app.use(morgan('common'))
app.use(cors())

app.get('/', (req, res, next)=>{
    res.send({'data':data})
})
app.get('/:id', (req, res, next)=>{
    let id = req.params.id
    let result = data.filter(entry => entry.ID == id)
    if (result.length === 0){
        next({'status':500, 'error': 'No matching ID found'})
    }
    res.send({'result': result[0]})
})
app.use((err, req, res, next)=>{
    res.status(err.status).send({'error':err.error})
})
app.use((req, res)=> {
    res.status(404).send({'error':'Not Found'})
})
const listener = ()=> console.log(`Port Party at ${port}`)

app.listen(port, listener)
