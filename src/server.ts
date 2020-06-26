import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import compression from "compression";
import cors from "cors";

import indexRoutes from "./routes/indexRoutes";
import PostRoutes from "./routes/PostsRoutes";

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    const MONGO_URI = `mongodb+srv://root:root@cluster0-3s0ia.mongodb.net/test?retryWrites=true&w=majority`;
    mongoose.set("useFindAndModify", true);
    mongoose
      .connect(MONGO_URI || process.env.MONGO_DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      })
      .then((db) => console.log("DB is connected"))
      .catch((err) => console.error(err));

    // settings
    this.app.set("port", process.env.PORT || 3000);

    // middlewares
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors());
  }

  routes() {
    this.app.use(indexRoutes);
    this.app.use("/api/posts", PostRoutes);
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log(`Server running on port: ${this.app.get("port")}`);
    });
  }
}

const server = new Server();
server.start();
