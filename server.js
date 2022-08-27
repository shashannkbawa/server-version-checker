const express = require('express');
const DataStore = require('nedb')

const port = 4000
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const database = new DataStore('database.db')
database.loadDatabase();

app.post('/updateDatabase', (req, res) => {
    const dataToUpdateDatabase = req.body
    console.log(dataToUpdateDatabase);
    const data = {
        masterNodeData: dataToUpdateDatabase
    }
    database.remove({}, { multi: true })
    database.insert(data)
    res.send({
        result: "Database Updated"
    })
    console.log("updated")
})

app.post('/getConfirmation', (req, res) => {

    const toSendData = []
    const dataFromClient = req.body

    console.log(dataFromClient)

    database.find({}, function (err, doc) {
        if (err)
            console.log(err)
        else {

            for (let index = 0; index < doc[0].masterNodeData.length; index++) {
                dataFromClient.find((data) => {
                    if (data.path == doc[0].masterNodeData[index].path) {
                        if (data.hash == doc[0].masterNodeData[index].hash) {
                            console.log("correct")
                            toSendData.push({
                                path: data.path,
                                result: "Correct"
                            })
                        }
                        else {
                            console.log("incorrect")
                            toSendData.push({
                                path: data.path,
                                result: "Incorrect"
                            })
                        }
                    }
                })
            }
        }
        console.log(toSendData);
        res.send(toSendData)
    })
})
app.listen(port, () => console.log("Listening on port" + port));