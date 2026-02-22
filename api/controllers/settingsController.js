import Settings from '../models/Settings.js';

// Get Global Settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({}); // Create default if none exists
    }
    res.json(settings);
  } catch (error) {
    console.error('Fetch Settings Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update Announcement Bar
export const updateAnnouncement = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings({});
    }
    
    // Spread new announcement data over existing
    settings.announcementBar = {
        ...settings.announcementBar,
        ...req.body
    };

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Update Announcement Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
