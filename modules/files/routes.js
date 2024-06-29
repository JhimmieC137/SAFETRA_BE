const express = require("express");
const { authMiddleware, isAdmin } = require("../../middlewares/authMiddleware");

const { validateRegisterUserRequest } = require("../../helpers/validators");
const {
    getFiles,
    getFile,
    uploadFile,
    updateFile,
    deleteFile,
    uploadMultipleFiles
} = require("./contollers");
const fileUpload = require("express-fileupload");
const { fileExtLimiter, fileSizeLimiter } = require("../../helpers/fileHelper");
const multer = require("multer");
const { MULTER_S3_CONFIG } = require("../../util/fileUploader");
const { uploadMiddleware } = require("../../middlewares/fileMiddleware");


const fileRouter = express.Router();
const route = '/files';


fileRouter.get("/", authMiddleware,  getFiles);
fileRouter.get("/:id", authMiddleware, getFile);
fileRouter.post("/multiple", authMiddleware, fileUpload(), uploadMiddleware);
fileRouter.post("/", authMiddleware, fileUpload(), fileExtLimiter, fileSizeLimiter,  uploadFile);
fileRouter.patch("/:id", authMiddleware, updateFile);
fileRouter.delete("/:id", authMiddleware, deleteFile);

module.exports = {
    fileRouter,
    route,
};