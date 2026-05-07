const db = require('../config/db');

exports.createInquiry = async (req, res) => {
    try {
        console.log('Inquiry Request Body:', req.body);
        const { email, service_type, name, message } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        console.log('Inserting into DB:', [email, service_type || 'General', name || null, message || null]);
        await db.execute(
            'INSERT INTO inquiries (email, service_type, name, message) VALUES (?, ?, ?, ?)',
            [email, service_type || 'General', name || null, message || null]
        );

        res.status(201).json({ message: 'Inquiry submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllInquiries = async (req, res) => {
    try {
        const [inquiries] = await db.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
        res.json(inquiries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!['pending', 'contacted', 'resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await db.execute('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Inquiry status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
