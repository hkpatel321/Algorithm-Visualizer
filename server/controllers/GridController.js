const Grid = require('../models/Grid');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GridController = {};

// Save map path
GridController.saveMapPath = async (req, res) => {
  try {
    const { startPoint, endPoint, path } = req.body;
    const userId = req.user.id;

    const mapPath = await Grid.create({
      userId,
      gridData: path,
      startNode: startPoint,
      endNode: endPoint,
      type: 'map'
    });

    res.status(201).json({ success: true, message: 'Map path saved successfully', mapPath });
  } catch (error) {
    console.error('Error saving map path:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get user's saved map paths
GridController.getMapPaths = async (req, res) => {
  try {
    const userId = req.user.id;
    const mapPaths = await Grid.find({ userId, type: 'map' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, mapPaths });
  } catch (error) {
    console.error('Error loading map paths:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

GridController.saveGrid = async (req, res) => {
  try {
    const { gridData, startNode, endNode } = req.body;
    const userId = req.user.id;

    const grid = new Grid({ userId, gridData, startNode, endNode });
    await grid.save();

    res.status(201).json({ success: true, message: 'Grid saved successfully', grid });
  } catch (error) {
    console.error('Error saving grid:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

GridController.loadGrids = async (req, res) => {
  try {
    const userId = req.user.id;
    const grids = await Grid.find({ userId }).sort({ createdAt: -1 });
    console.log("Grids",grids);
    res.status(200).json({ success: true, grids });
  } catch (error) {
    console.error('Error loading grids:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

GridController.generateGridExplanation = async (req, res) => {
  try {
    const { algorithm, grid } = req.body;
    if (!algorithm || !grid) {
      return res.status(400).json({ success: false, message: 'Missing algorithm or grid.' });
    }
    const prompt = `Explain step by step how the ${algorithm} algorithm would work on the following grid. The grid is a 2D array of nodes, each node has row, col, isStart, isEnd, isWall. Give a detailed, node-by-node explanation with examples from this grid. Output as a list of steps for a tutorial.`;
    const gridPreview = JSON.stringify(grid, null, 2).slice(0, 2000); // Truncate for safety
    const fullPrompt = `${prompt}\nGrid:\n${gridPreview}`;
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    let steps = text.split(/\n\d+\.|\n- |\n• |\n/).map(s => s.trim()).filter(Boolean);
    if (steps.length === 1) {
      steps = text.split(/\n/).map(s => s.trim()).filter(Boolean);
    }
    res.json({ success: true, steps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate explanation.' });
  }
};

module.exports = GridController;
