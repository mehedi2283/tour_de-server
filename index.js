const express = require ('express')
const cors = require ('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w5am0gy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{

        const serviceCollection = client.db('tour').collection('services');
        app.get('/services', async (req,res) =>{

            const querry = {}
            const cursor = serviceCollection.find(querry)
            const services = await cursor.toArray();
            res.send(services);

    })

  }

    finally{

    }

}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('tourDE server is running')
})

app.listen(port, ()=> {
    console.log(`tourDE server is running on port ${port}`);
})