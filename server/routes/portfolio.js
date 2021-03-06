const {
    createProject,
    deleteProject,
    getProjects,
    getProject,
    updateProject,
} = require("../controllers/portfolio");
const { protect, authorize } = require("../middleware/auth");
const router = require("express").Router();

const multer = require("../config/multer");

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", protect, authorize("admin"), multer, createProject);
router.put("/:id", protect, authorize("admin"), multer, updateProject);
router.delete("/:id", protect, authorize("admin"), deleteProject);

module.exports = router;
