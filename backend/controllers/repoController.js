const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository(req, res) {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    res.status(201).json({
      success: true,
      message: "Repository created!",
      data: { repositoryID: result._id },
    });
  } catch (err) {
    console.error("Error during repository creation: ", err.message);

    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json({ data: repositories });
  } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).send({ error: "Server error" });
  }
}

async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findOne({ _id: id })
      .populate("owner")
      .populate("issues");
    if (!repository || !repository.owner || !repository.issues) {
      return res.status(404).json({
        success: false,
        error: "Repository or related data not found!",
      });
    }

    res.json({ data: repository });
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send({ error: "Server error" });
  }
}

async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.findOne({ name })
      .populate("owner")
      .populate("issues");
    if (!repository || !repository.owner || !repository.issues) {
      return res.status(404).json({
        success: false,
        error: "Repository or related data not found!",
      });
    }

    res.json({ data: repository });
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send({ error: "Server error" });
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  console.log(req.params);
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID });

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({
      success: "true",
      message: "Repositories found!",
      data: { repositories },
    });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send({ error: "Server error" });
  }
}

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository || !repository.owner || !repository.issues) {
      return res.status(404).json({
        success: false,
        error: "Repository or related data not found!",
      });
    }

    if (content) repository.content.push(content);

    if (description) {
      repository.description = description;
    }

    const updatedRepository = await repository.save();

    res.json({
      success: true,
      message: "Repository updated successfully!",
      data: { repository: updatedRepository },
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).send({ error: "Server error" });
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository || !repository.owner || !repository.issues) {
      return res.status(404).json({
        success: false,
        error: "Repository or related data not found!",
      });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      data: { repository: updatedRepository },
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).send({ error: "Server error" });
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send({ error: "Server error" });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
