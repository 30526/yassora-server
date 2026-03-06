const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

   const database = client.db('yassoraaDB')
   const productsCollection = database.collection('products')
    // Send a ping to confirm a successful connection

    app.post('/products',async(req, res)=>{
        const product = req.body
    const result = await productsCollection.insertOne(product)
res.send(result )})

app.get('/products', async( req, res)=>{
    const cursor = productsCollection.find()
    const products = await cursor.toArray()
    res.send(products)
})

app.get('/products/:id', async(req, res)=>{
    const id = req.params.id
    const query ={_id: new ObjectId(id)}
    const product = await productsCollection.findOne(query)
    res.send(product)})


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Hello World!')
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

