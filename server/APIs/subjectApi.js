const exp = require('express');
const subjectApp = exp.Router();
const Subject = require("../models/subjectModel");
const expressAsyncHandler = require("express-async-handler");

// Get all active subjects
subjectApp.get("/", expressAsyncHandler(async (req, res) => {
    const subjects = await Subject.find({ isActive: true });
    res.status(200).send({ message: "All subjects", payload: subjects });
}));

// Create new subject
subjectApp.post("/create", expressAsyncHandler(async (req, res) => {
    const { name, fullName, description, icon } = req.body;
    
    const savedSubject = await new Subject({
        name,
        fullName,
        description,
        icon
    }).save();
    
    res.status(201).send({ message: "Subject created", payload: savedSubject });
}));

// Get subject by ID
subjectApp.get("/:subjectId", expressAsyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.subjectId);
    res.status(200).send({ message: "Subject details", payload: subject });
}));

module.exports = subjectApp;