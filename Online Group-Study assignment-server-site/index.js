const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://online-group-study-7e15a.web.app',
        'https://online-group-study-7e15a.firebaseapp.com'
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
    const token = req?.cookies?.jwt_token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = decoded;
        next();
    });
};


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5yy5rq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const assignmentCollection = client.db("Online_Group_Study_DB").collection("assignment");
        const myAssignmentCollection = client.db("Online_Group_Study_DB").collection("myAssignment");
        const userCollection = client.db("Online_Group_Study_DB").collection("users");

        // Add assignment to DB
        app.post("/assignment", verifyToken, async (req, res) => {
            const data = req.body;
            const result = await assignmentCollection.insertOne(data);
            res.send(result);
        });

        // Get assignment from DB
        app.get("/assignment", async (req, res) => {
            try {
                const difficultyLevel = req.query.difficulty;
                const query = difficultyLevel ? { difficultyLevel } : {};
                const assignments = await assignmentCollection.find(query).toArray();
                res.json(assignments);
            } catch (error) {
                console.error("Error fetching assignments:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        // Delete assignment from DB
        app.delete("/assignment/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            try {
                const result = await assignmentCollection.deleteOne(query);
                res.json(result);
            } catch (error) {
                console.error("Error deleting item:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        // Add myAssignment to DB
        app.post("/myAssignment", verifyToken, async (req, res) => {
            const data = req.body;
            const result = await myAssignmentCollection.insertOne(data);
            res.send(result);
        });

        // Get mySubmittedAssignment for specific user
        app.get('/mySubmittedAssignment', verifyToken, async (req, res) => {
            let query = {};
            if (req.query?.submittedUser) {
                query = { submittedUser: req.query.submittedUser };
            }
            const result = await myAssignmentCollection.find(query).toArray();
            res.send(result);
        });

        // Get allSubmittedAssignment from DB
        app.get("/allSubmittedAssignment", async (req, res) => {
            let query = {};
            if (req.query?.status) {
                query = { status: req.query.status }
            }
            const result = await myAssignmentCollection.find(query).toArray();
            res.send(result);
        });

        // Handle GET request to fetch assignment details for a single assignment
        app.get('/assignment/assignmentDetails/:_id', verifyToken, async (req, res) => {
            const { _id } = req.params;
            console.log('cookies:', req.cookies);
            try {
                const objectId = new ObjectId(_id);
                const assignment = await assignmentCollection.findOne({ _id: objectId });
                if (assignment) {
                    res.json(assignment); // Respond with the product details
                } else {
                    res.status(404).json({ error: 'Product not found' });
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Handle GET request to fetch assignment details for update
        app.get('/assignment/updateAssignment/:id', verifyToken, async (req, res) => {
            const { id } = req.params;
            try {
                const objectId = new ObjectId(id);
                const assignment = await assignmentCollection.findOne({ _id: objectId });
                if (assignment) {
                    res.json(assignment); // Respond with the product details
                } else {
                    res.status(404).json({ error: 'Product not found' });
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Handle PUT request to update myAssignment information
        app.put('/myAssignment/:_id', verifyToken, async (req, res) => {
            const { _id } = req.params;
            const updatedData = req.body;
            try {
                const result = await myAssignmentCollection.updateOne(
                    { _id: new ObjectId(_id) },
                    {
                        $set: {
                            givenMarks: updatedData.givenMarks,
                            quickNote: updatedData.quickNote,
                            status: updatedData.status,
                        },
                    }
                );
                if (result.modifiedCount === 1) {
                    res.status(200).json({ message: 'Car information updated successfully' });
                } else {
                    res.status(404).json({ error: 'Car not found' });
                }
            } catch (error) {
                console.error('Error updating car information:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Handle PUT request to update assignment information
        app.put('/assignment/:_id', verifyToken, async (req, res) => {
            const { _id } = req.params;
            const updateData = req.body; // The updated data sent in the request body
            try {
                const assignment = await assignmentCollection.findOne({ _id: new ObjectId(_id) });
                if (!assignment) {
                    return res.status(404).json({ error: 'Assignment not found' });
                }
                const result = await assignmentCollection.updateOne(
                    { _id: new ObjectId(_id) }, // Filter based on the _id
                    {
                        $set: {
                            title: updateData.title,
                            description: updateData.description,
                            marks: updateData.marks,
                            imageURL: updateData.imageURL,
                            difficultyLevel: updateData.difficultyLevel,
                            dueDate: updateData.dueDate,
                        },
                    }
                );
                if (result.modifiedCount === 1) {
                    res.status(200).json({ message: 'Assignment information updated successfully' });
                } else {
                    res.status(500).json({ error: 'Failed to update assignment' });
                }
            } catch (error) {
                console.error('Error updating assignment information:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Add users to DB
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // JWT
        app.post('/jwt', async (req, res) => {
            try {
                const user = req.body;
                // Validate user data here
                const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                res.cookie('jwt_token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                }).send({ success: true, user });
            } catch (error) {
                console.error('Error creating JWT:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.post('/logOut', async (req, res) => {
            const user = req.body;
            res
                .clearCookie('jwt_token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/'  // Set the correct path used when setting the cookie
                })
                .send({ success: true });
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Online Group-Study assignment server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});