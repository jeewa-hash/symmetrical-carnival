import Report from '../models/reportModel.js'; // Import the report model

// Controller to get the count of completed deliveries
export const getCompletedDeliveriesCount = async (req, res) => {
    try {
        // Query the database for the count of documents with delivery_Status "Completed"
        const completedCount = await Report.countDocuments({ delivery_Status: "Completed" });
        
        // Send the count as a JSON response
        res.status(200).json({ completedCount });
    } catch (error) {
        // Handle any errors that may occur during the database query
        res.status(500).json({ message: "Server error", error });
    }
};
