import { readFileSync } from "fs";
import express from "express";
import { v4 as uuid } from "uuid";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/images/" });

// 内存中保存的上传视频
const uploadedVideos = [];

// 读取视频数据
const readVideosData = () => JSON.parse(readFileSync("./data/videos.json", "utf-8"));

// 获取视频列表
router.route("/")
    .get((req, res) => {
        const defaultVideos = readVideosData();
        const allVideos = [...defaultVideos, ...uploadedVideos];
        res.json(allVideos.map(video => ({
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image,
        })));
    })
    .post(upload.single("image"), (req, res) => {
        if (req.body && req.body.title && req.body.description) {
            let imageUrl = `http://localhost:8080/images/default.jpg`;

            if (req.file) {
                imageUrl = `http://localhost:8080/images/${req.file.filename}`;
            }

            const newVideo = {
                id: uuid(),
                title: req.body.title,
                channel: "BrainFlix User",
                image: imageUrl,
                description: req.body.description,
                views: "0",
                likes: "0",
                duration: "0:00",
                video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream?api_key=1b06fab0-9e2f-461b-a0a6-23fee89cd50c",
                timestamp: Date.now(),
                comments: [],
            };
            uploadedVideos.push(newVideo);
            res.status(201).json(newVideo);
        } else {
            res.status(400).send("Please include title and description in the request body.");
        }
    });

// 获取特定视频信息
router.route("/:id").get((req, res) => {
    const defaultVideos = readVideosData();
    const allVideos = [...defaultVideos, ...uploadedVideos];
    const video = allVideos.find((video) => video.id === req.params.id);
    if (video) {
        res.json(video);
    } else {
        res.status(404).send({ message: "Video not found" });
    }
});

export default router;
