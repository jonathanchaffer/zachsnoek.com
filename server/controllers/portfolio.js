const Project = require("../models/Project");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const deleteImage = require("../config/multer").deleteImage;

const portfolioImagePath = "assets/img/portfolio";
const createImagePath = (filename) => `${portfolioImagePath}/${filename}`;

// Returns an array of non-empty unique strings
const filterTags = (tags) => {
    const filteredTags = tags.filter((tag) => tag.length > 0);
    return [...new Set(filteredTags)];
};

// @desc    Create a new project
// @route   POST /api/v1/portfolio
// @access  Private
module.exports.createProject = asyncHandler(async (req, res, next) => {
    req.body.image = createImagePath(req.file.filename);
    req.body.tags = filterTags(req.body.tags);

    const position = (await Project.countDocuments({})) + 1;
    const project = await Project.create({
        ...req.body,
        position,
    });

    res.status(201).json({
        success: true,
        data: project,
    });
});

// @desc    Get all projects
// @route   GET /api/v1/portfolio
// @access  Public
module.exports.getProjects = asyncHandler(async (req, res, next) => {
    const projects = await Project.find().sort({ position: 1 });

    res.status(200).json({
        success: true,
        data: projects,
    });
});

// @desc    Get a project
// @route   GET /api/v1/project/:id
// @access  Public
module.exports.getProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(
            new ErrorResponse(
                `No project exists with an ID of ${req.params.id}.`,
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        data: project,
    });
});

// @desc    Update a project
// @route   PUT /api/v1/portfolio/:id
// @access  Private
module.exports.updateProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(
            new ErrorResponse(
                `No project exists with an ID of ${req.params.id}.`,
                404
            )
        );
    }

    if (req.file) {
        req.body.image = createImagePath(req.file.filename);
        const { image } = project;
        const filename = image.split("/").slice(-1);
        await deleteImage(filename);
    }

    const { tags } = req.body;
    if (tags) {
        req.body.tags = filterTags(tags);
    }

    const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        data: updatedProject,
    });
});

// @desc    Delete a project
// @route   DELETE /api/v1/portfolio/:id
// @access  Private
module.exports.deleteProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(
            new ErrorResponse(
                `No project exists with an ID of ${req.params.id}.`,
                404
            )
        );
    }

    const { image } = project;
    const filename = image.split("/").slice(-1);

    await deleteImage(filename);
    await project.remove();

    res.status(200).json({
        success: true,
        data: req.params.id,
    });
});
