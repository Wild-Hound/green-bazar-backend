const express = require('express')
const cors = require('cors')
const parser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const app = express()
require('dotenv').config()
app.use(cors())
app.use(parser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.styhn.mongodb.net/db1?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })



 client.connect(async (err) => {
    const collection = client.db("db1").collection("react-pro");
    const collection2 = client.db("db1").collection("purchased");
    app.get('/get/products', async(req,res) =>{
        await collection.find({})
        .toArray((err, docs) =>{
            res.send(docs)
        })
    })
        
    app.post('/add/product', async(req,res) =>{
        if(req.body){
            await collection.insertOne(req.body).then((data) => {
                if(data.insertedCount > 0){
                    res.send(JSON.stringify({message:true}))
                }else{
                    res.send(JSON.stringify({message:false}))
                }
            }); 
        }else{
            res.send(JSON.stringify({message:false}))
        }
    })

    app.delete('/delete/:id',(req,res)=>{
        collection.deleteOne({_id:ObjectID(req.params.id)})
        .then(data=>{
            if(parseInt(data.deletedCount) > 0){
                res.send(JSON.stringify({message:true}))
            }
            else {
                res.send(JSON.stringify({message:false}))
            }
    })

    })

    app.post('/buy',(req,res)=>{
        collection2.insertOne(req.body).then((data) => res.send(JSON.stringify(data)))
    })

 })


app.listen(process.env.PORT || 5200)