const Grid = require('../models/Grid');

const GridController = {};

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

module.exports = GridController;
