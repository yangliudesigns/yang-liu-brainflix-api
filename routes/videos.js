import express from "express";
import {
    get,
    post,
    getVideo,
    putVideoLike,
    preprocess,
    preprocessVideoId,
} from "../controllers/videosController.js";
import commentsRoute from "./comments.js";

const router = express.Router();

router.use(preprocess);
router.use("/:videoId", preprocessVideoId);

router.route("/").get(get).post(post);
router.get("/:videoId", getVideo);
router.put("/:videoId/likes", putVideoLike);

router.use("/:videoId/comments", commentsRoute);

export default router;
