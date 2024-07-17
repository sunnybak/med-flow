// app/api/patient/notes/notes.ts
import express from 'express';
import Note from '../../../../models/note';

const router = express.Router();

// POST Endpoint to add a new note
router.post('/add', async (req, res) => {
    try {
        const { content, username, patientId } = req.body;
        const newNote = new Note({
            content,
            username,
            patientId
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "An unknown error occurred." });
        }
    }
});

// GET endpoint to fetch notes for a specific patient
router.get('/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const notes = await Note.find({ patientId }).sort({ date: -1 });
        res.json(notes);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred." });
        }
    }
});

export default router;