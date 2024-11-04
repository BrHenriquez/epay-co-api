import mongoose from "mongoose";

const dbCredentials = {
    username: process.env.DB_USERNAME || "admin",
    password: process.env.DB_PASSWORD || "Password1234",
    clusterUrl: process.env.DB_CLUSTER_URL || "epay-co-db.bhtue.mongodb.net"
};

export const connectToDb = async () => {
    const dbUri = `mongodb+srv://${dbCredentials.username}:${dbCredentials.password}@${dbCredentials.clusterUrl}/`;

    try {
        await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Cannot connect to DB:", error.message);
    }
};
