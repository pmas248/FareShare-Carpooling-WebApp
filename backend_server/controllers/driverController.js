const Driver = require('../models/Driver');
const User = require('../models/User');

// driverController.js
exports.createDriver = async (req, res) => {
  const { licenseNo, carName, seats } = req.body;
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existing = await Driver.findOne({ userID: user._id });
    if (existing) return res.status(400).json({ message: 'Driver profile already exists' });

    const newDriver = new Driver({ userID: user._id, licenseNo, carName, seats });
    await newDriver.save();

    user.licenseValidated = true;
    await user.save();

    res.status(201).json(newDriver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getDriver = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.params.driverID });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const driver = await Driver.findOne({ userID: user._id });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    res.status(200).json({ driverId: driver._id });
  } catch (err) {
    console.error("Error fetching driver:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateDriver = async (req, res) => {
  const { licenseNo, carName, seats } = req.body;
  try {
    // find the logged-in user
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // find their existing driver profile
    const existing = await Driver.findOne({ userID: user._id });
    if (!existing) return res.status(404).json({ message: 'Driver profile not found' });

    // update & save
    existing.licenseNo = licenseNo;
    existing.carName  = carName;
    existing.seats    = seats;
    await existing.save();

    res.status(200).json(existing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating driver' });
  }
};