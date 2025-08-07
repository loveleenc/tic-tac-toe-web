import liveDatabase from "./database/DatabaseLive";
import testDatabase from "./database/DatabaseTest";

function getDatabase(){
    switch(process.env.NODE_ENV){
        case "production":
            return liveDatabase;
        case "development":
            return liveDatabase;
        case "test":
            return testDatabase;
        default:
            throw new Error("Incorrect database instance is being fetched")
    }
}

export const database = getDatabase