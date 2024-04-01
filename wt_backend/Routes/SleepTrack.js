const express = require('express');
const router = express.Router();

const authTokenHandler = require('../Middlewares/checkAuthToken');
const errorHandler = require('../Middlewares/errorMiddleware');
const User = require('../Models/UserSchema');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/addsleepentry', authTokenHandler, async (req, res) => {
    const { date, durationInHrs } = req.body;

    if (!date || !durationInHrs) {
        return res.status(400).json(createResponse(false, 'Please provide date and sleep duration'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.sleep.push({
        date : new Date(date),
        durationInHrs,
    });

    await user.save();
    res.json(createResponse(true, 'Sleep entry added successfully'));
});

router.post('/getsleepbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;

    const user = await User.findById({ _id: userId });

    if (!date) {
        let date = new Date();
        user.sleep = filterEntriesByDate(user.sleep, date);

        return res.json(createResponse(true, 'Sleep entries for today', user.sleep));
    }

    user.sleep = filterEntriesByDate(user.sleep, new Date(date));
    res.json(createResponse(true, 'Sleep entries for the date', user.sleep));
});


// has a bug
router.post('/getsleepbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All sleep entries', user.sleep));
    } else {

        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();

   
        
        user.sleep = user.sleep.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, `Sleep entries for the last ${limit} days`, user.sleep));
    }
});

router.delete('/deletesleepentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(createResponse(false, 'User not found'));
        }

        console.log('Current sleep entries:', user.sleep);

        // Filter out the sleep entry with matching date
        user.sleep = user.sleep.filter(entry => {
            // Ensure proper date comparison here
            return entry.date.toString() !== new Date(date).toString();
        });

        // Log sleep entries after deletion
        console.log('Updated sleep entries:', user.sleep);

        // Save the updated user object
        await user.save();
        res.json(createResponse(true, 'Sleep entry deleted successfully'));
    } catch (error) {
        console.error('Error deleting sleep entry:', error);
        res.status(500).json(createResponse(false, 'An error occurred while deleting sleep entry'));
    }
});


router.get('/getusersleep', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    const goalSleep = 6;

    res.json(createResponse(true, 'User max sleep information', {goalSleep }));
});

router.use(errorHandler);

function filterEntriesByDate(entries, targetDate) {
    return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
            entryDate.getDate() === targetDate.getDate() &&
            entryDate.getMonth() === targetDate.getMonth() &&
            entryDate.getFullYear() === targetDate.getFullYear()
        );
    });
}

module.exports = router;
