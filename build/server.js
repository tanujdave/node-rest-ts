"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const PostsRoutes_1 = __importDefault(require("./routes/PostsRoutes"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        const MONGO_URI = `mongodb+srv://root:root@cluster0-3s0ia.mongodb.net/test?retryWrites=true&w=majority`;
        mongoose_1.default.set("useFindAndModify", true);
        mongoose_1.default
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
        this.app.use(morgan_1.default("dev"));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(helmet_1.default());
        this.app.use(compression_1.default());
        this.app.use(cors_1.default());
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use("/api/posts", PostsRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get("port"), () => {
            console.log(`Server running on port: ${this.app.get("port")}`);
        });
    }
}
const server = new Server();
server.start();
