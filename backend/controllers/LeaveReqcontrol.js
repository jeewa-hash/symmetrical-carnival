import LeaveReqModel from "../models/LeaveReqModel.js"; // Ensure path is correct

// Fetch all leave records
export const fetchAllLeave = async (req, res) => {
    try {
        const leaveRecords = await LeaveReqModel.find();
        res.json(leaveRecords);
    } catch (error) {
        console.error('Error fetching leave records:', error);
        res.status(500).json({ msg: 'Failed to fetch leave records', error: error.message });
    }
};




export const addLeaveRequest = async (req, res) => {
    try {
        console.log(req.fields);
        const { empId, name, startDate, endDate, reason, type, createdAt } = req.fields;

        // Validation checks using a switch statement
        switch (true) {
            case !empId:
                return res.json({ error: "Employee ID is required" });
            case !name:
                return res.json({ error: "Employee name is required" });
            case !startDate:
                return res.json({ error: "Start date is required" });
            case !endDate:
                return res.json({ error: "End date is required" });
            case !reason:
                return res.json({ error: "Reason for leave is required" });
            case !type:
                return res.json({ error: "Leave type is required" });
        }

        // Create a new leave request using the model
        const leaveRequest = new LeaveReq({
            empId,
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            type,
            createdAt: createdAt ? new Date(createdAt) : undefined
        });

        // Save the leave request to the database
        await leaveRequest.save();

        // Respond with a success message
        res.status(201).json({ msg: "Leave request added successfully" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: "Leave request adding failed", error });
    }
};

