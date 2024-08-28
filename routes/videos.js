import { readFileSync, writeFileSync } from "fs";
import express from "express";
import { v4 as uuid } from "uuid";

const router = express.Router();

router
    .route("/")
    .get((req, res) => {
        const data = readFileSync("./data/videos.json", "utf-8");
        res.json(JSON.parse(data));
    })
    .post((req, res) => {
        const data = readFileSync("./data/videos.json", "utf-8");
        const videoData = JSON.parse(data);
        if (req.body && req.body.title && req.body.description) {
            const newVideo = {
                id: uuid(),
                title: req.body.title,
                channel: "DOMOMO",
                image: `http://localhost:8080/images/${req.body.image || 'default.jpg'}`, 
                description: req.body.description,
                views: "9,392",
                likes: "7,584",
                duration: "3:25",
                video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream", 
                timestamp: Date.now(),
                comments: [],
            };
            const newVideoData = [...videoData, newVideo];
            writeFileSync("./data/videos.json", JSON.stringify(newVideoData));
            res.send("Video data updated");
        } else {
            res.status(400).send("You forgot to include json data in your request");
        }
    });

router.route("/:id").get((req, res) => {
    const data = readFileSync("./data/videos.json", "utf-8");
    const videos = JSON.parse(data);
    const foundVideo = videos.find((video) => video.id === req.params.id);
    if (foundVideo) {
        res.json(foundVideo);
    } else {
        res.status(404).send({ message: "Video not found" });
    }
});

router
    .route("/:id/comments")
    .post((req, res) => {
        const data = readFileSync("./data/videos.json", "utf-8");
        const videoData = JSON.parse(data);

        if (req.body && req.body.comment) {
            const newComment = {
                id: uuid(),
                name: "Kiwoon",
                comment: req.body.comment,
                likes: 0,
                timestamp: Date.now(),
            };

            const newVideoData = videoData.map((video) => {
                if (video.id === req.params.id) {
                    video.comments.push(newComment);
                }
                return video;
            });

            writeFileSync("./data/videos.json", JSON.stringify(newVideoData));
            res.send("Comment added");
        } else {
            res.status(400).send("You forgot to include json data in your request");
        }
    });

router
    .route("/:videoId/comments/:commentId")
    .delete((req, res) => {
        const data = readFileSync("./data/videos.json", "utf-8");
        const videoData = JSON.parse(data);
        const selectedVideoId = req.params.videoId;
        const selectedCommentId = req.params.commentId;

        const newVideoData = videoData.map((video) => {
            if (video.id === selectedVideoId) {
                const indexOfComment = video.comments.findIndex(
                    (comment) => comment.id === selectedCommentId
                );
                if (indexOfComment !== -1) {
                    video.comments.splice(indexOfComment, 1);
                }
            }
            return video;
        });

        writeFileSync("./data/videos.json", JSON.stringify(newVideoData));
        res.send("Comment deleted");
    });

router
    .route("/:videoId/likes")
    .put((req, res) => {
        const data = readFileSync("./data/videos.json", "utf-8");
        const videoData = JSON.parse(data);

        const newVideoData = videoData.map((video) => {
            if (video.id === req.params.videoId) {
                video.likes++;
            }
            return video;
        });

        writeFileSync("./data/videos.json", JSON.stringify(newVideoData));
        res.send("Like count updated");
    });

export default router;
