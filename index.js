const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.SECRET_user}:${process.env.SECRET_KEY}@brainytoy.uw3gtqh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
  const brainYToyCollection = client.db("BrainYT").collection("StoreDB");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

  // brainYToys Get in Server
  app.get("/brainy", async (req, res) =>{
     const cursor = brainYToyCollection.find()
     const result = await cursor.toArray();
     res.send(result);
      
  });

  app.get("/brainy/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await brainYToyCollection.findOne(query)
    res.send(result);

  });
  

   
  //  brainYToys Server Added
   app.post("/brainy", async (req, res) => {

    const brainYToys = req.body;
    // console.log(brainYToys);
   
    const result = await brainYToyCollection.insertOne(brainYToys);
    res.send(result);
 
   });
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("BrainYToy Store server in production");
});

app.listen(port, () => {
  console.log("BrainYToy Server Store listening on port " + port);
});