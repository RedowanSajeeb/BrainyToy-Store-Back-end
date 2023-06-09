const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
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
    // await client.connect();

    // brainYToys Get in Server
    app.get("/brainy", async (req, res) => {
      const cursor = brainYToyCollection.find();
      const result = await cursor.limit(20).toArray();
      res.send(result);
    });

    app.get("/brainy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brainYToyCollection.findOne(query);
      // const result = await cursor.toArray(query)
      res.send(result);
    });

    // Category

    app.get("/categorymath", async (req, res) => {
      const query = { category: { $eq: "Math Toys" } };
      const cursor = brainYToyCollection.find(query);

      const result = await cursor.toArray(query);

      res.send(result);
    });

    app.get("/scienceToys", async (req, res) => {
      const query = { category: { $eq: "Science Toys" } };
      const cursor = brainYToyCollection.find(query);

      const result = await cursor.toArray(query);

      res.send(result);
    });

    app.get("/languageToys", async (req, res) => {
      const query = { category: { $eq: "Language Toys" } };
      const cursor = brainYToyCollection.find(query);

      const result = await cursor.toArray(query);

      res.send(result);
    });

    app.get("/engineeringTools", async (req, res) => {
      const query = { category: { $eq: "engineering tools" } };
      const cursor = brainYToyCollection.find(query);

      const result = await cursor.toArray(query);

      res.send(result);
    });

    app.get("/brainyemail", async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const resust = await brainYToyCollection.find(query).toArray();

      res.send(resust);
    });

    //  brainYToys Server Added
    app.post("/brainy", async (req, res) => {
      const brainYToys = req.body;
      // console.log(brainYToys);

      const result = await brainYToyCollection.insertOne(brainYToys);
      res.send(result);
    });

    app.get("/getSearchByToyName/:text", async (req, res) => {
      const searchText = req.params.text;
      const result = await brainYToyCollection
        .find({
          toyName: { $regex: searchText, $options: "i" },
        })
        .toArray();
      res.send(result);
    });

    // ascending-d

 app.get("/brainyemailascending", async (req, res) => {
   // console.log(req.query.email);
   let query = {};
   if (req.query?.email) {
     query = { email: req.query.email };
   }
   const options = {
     // sort returned documents in ascending order by title (A->Z)
     sort: {price: 1 },
     // Include only the `title` and `imdb` fields in each returned document
   };

   const resust = await brainYToyCollection.find(query,options).toArray();

   res.send(resust);
 });

// ------------------------------

    app.get("/ascending", async (req, res) => {
      const toyCollection = await brainYToyCollection.find().toArray();

      const sortedToys = toyCollection.sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        return priceA - priceB;
      });

      res.send(sortedToys);
    });



    // Descending;

// ==========================
// my toy page
 app.get("/brainyemdescending", async (req, res) => {
   // console.log(req.query.email);
   let query = {};
   if (req.query?.email) {
     query = { email: req.query.email };
   }
   const options = {
     // sort returned documents in ascending order by title (A->Z)
     sort: { price: -1 },
     // Include only the `title` and `imdb` fields in each returned document
   };

   const resust = await brainYToyCollection.find(query, options).toArray();

   res.send(resust);
 });
// =================

    app.get("/descending", async (req, res) => {
      const toyCollection = await brainYToyCollection.find().toArray();

      const sortedToys = toyCollection.sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        return priceB - priceA;
      });

      res.send(sortedToys);
    });
// =============
    app.put("/brainy/:id", async (req, res) => {
      const id = req.params.id;
      const updateToydata = req.body;
      //  console.log(updateToydata);
      const filtirmongoid = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          price: updateToydata.price,
          quantity: updateToydata.quantity,
          description: updateToydata.description,
        },
      };

      const result = await brainYToyCollection.updateOne(
        filtirmongoid,
        updateDoc
      );
      res.send(result);
    });

    app.delete("/brainy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brainYToyCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await
    client.db("admin").command({ ping: 1 });
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