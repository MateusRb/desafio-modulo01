const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let requisitionsCount = 0;

server.use((req, res, next) => {
  requisitionsCount++;
  console.log(requisitionsCount);
  next();
});

function projectExists(req, res, next) {
  const project = projects.find(project => project.id == req.params.id);
  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }
  req.project = project;

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  res.json(projects);
});

server.put("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.title = title;

  res.json(req.project);
});

server.delete("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.tasks.push(title);

  res.json(req.project);
});

server.listen(3000);
