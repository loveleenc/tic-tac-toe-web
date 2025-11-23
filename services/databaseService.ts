import liveDatabase from "./database/DatabaseLive";

function getDatabase() {
    switch (process.env.NODE_ENV) {
        case "production":
            return liveDatabase;
        case "development":
            return liveDatabase;
        case "test":
            return liveDatabase;
        default:
            throw new Error("Incorrect database instance is being fetched")
    }
}

export const database = getDatabase