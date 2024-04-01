const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Task = require('./models/Task'); 

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/shopping_portal', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Not connect to MongoDB', err));

app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.post('/api/tasks', async (req, res) => {
    try {
        console.log(req.body);
      const { title, description, status } = req.body;
  
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }
  
      const task = new Task({
        title,
        description,
        status: status || 'pending'
      });
  
      await task.save();
      
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  });
  

app.put('/api/tasks/:id', async (req, res) => {
    try {
      
      const { title, description, status } = req.body;
  
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }
  
      const task = await Task.findByIdAndUpdate(req.params.id, {
        title,
        description,
        status: status || 'pending', 
        updatedAt: Date.now() 
      }, { new: true }); 
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });
  
app.delete('/api/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });
  
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
