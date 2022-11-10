const express = require ('express')
const cors = require ('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w5am0gy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{

        const serviceCollection = client.db('tourDE').collection('services');
        const reviewCollection = client.db('tourDE').collection('reviews');



        app.get('/', async (req,res) =>{
            const query = {}
            const cursor = serviceCollection.find(query).sort({_id:-1})
            const services = await cursor.limit(3).toArray();
            res.send(services);

    });
        app.get('/services', async (req,res) =>{
            const query = {}
            const cursor = serviceCollection.find(query).sort({_id:-1})
            const services = await cursor.toArray();
            res.send(services);

    });
        app.get('/details/:id', async (req,res) =>{
            const id = req.params.id


            const query = {_id:ObjectId(id)}
            const details =await serviceCollection.findOne(query)
            
            res.send(details);

    });

    //orders api
    app.post('/reviews', async (req,res) =>{
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
  
    })
    app.get('/reviews', async (req,res) =>{
        let query = {}
        if(req.query.service){
            query = {
                    service:req.query.service
            }
        }
        const cursor = reviewCollection.find(query).sort({_id:-1})
        const reviews = await cursor.toArray();
        res.send(reviews);

});
    app.get('/my_reviews', async (req,res) =>{
        let query = {}
        if(req.query.email){
            query = {
                    email:req.query.email
            }
        }
        const cursor = reviewCollection.find(query).sort({_id:-1})
        const myReviews = await cursor.toArray();
        res.send(myReviews);

});
    app.get('/update_review/:id', async (req,res) =>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const update =await reviewCollection.findOne(query)
            
        res.send(update);
        
        
       

});


app.put('/update_review/:id', async (req,res) =>{

    const id = req.params.id
    const filter = {_id:ObjectId(id)}
    const update = req.body
    const option = { upsert:true};
    const updatedReview = {
        $set:{
            customer: update.customer,
            phone: update.phone,
            message: update.message


            
        }
    }
    const result =await reviewCollection.updateOne(filter,updatedReview,option)
    res.send(result);




  }

);




app.delete('/my_reviews/:id', async (req,res) =>{
    const id = req.params.id


    const query = {_id:ObjectId(id)}
    const result =await reviewCollection.deleteOne(query)
    
    res.send(result);

});


app.post('/services', async (req,res) =>{
    const service = req.body;
    const result = await serviceCollection.insertOne(service);
    res.send(result);

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