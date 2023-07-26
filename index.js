const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fluahev.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const categoriesCollection = client
      .db("recruitPro")
      .collection("categories");
    const jobsCollection = client.db("recruitPro").collection("jobs");

    app.get("/categories", async (req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
    });

    app.get("/jobs", async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    });

    app.get("/allJobs", async (req, res) => {
      const search = req.query.search;
      console.log(search);
      const query = {
        $or: [
          { job_title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    });

    // app.get("/search/:key", async (req, res) => {
    //   const result = await jobsCollection
    //     .find({
    //       $or: [
    //         { job_title: { $regex: req.params.key, $options: "i" } },
    //         { location: { $regex: req.params.key, $options: "i" } },
    //       ],
    //     })
    //     .toArray();
    //   res.send(result);
    // });

    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(filter);
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
  res.send("recruit is running");
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
