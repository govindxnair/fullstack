const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sql, poolPromise } = require('./db.js'); // Assuming db.js is set up correctly

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

// get patient records
app.get('/api/patientdetails', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM pat1.Registration');
        console.log(result);
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});


//get patient records by id
app.get('/api/patientdetails/:ID', async (req, res) => {
    try {
        const { ID } = req.params;
        if (isNaN(ID)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }
        const pool = await poolPromise;
        const result = await pool.request().input("ID", sql.Int, ID).query('SELECT * FROM pat1.Registration WHERE ID = @ID');
        console.log(result);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        res.status(200).json(
            {
                success: true,
                data: result.recordset[0]
            }
        );
    }
    catch (error) {
        console.log('Error', error);
        res.status(500).json({
            success: false,
            message: 'Server Error,try again',
            error: error.message
        });
    }
});


//add new patient record
app.post('/api/patientdetails', async (req, res) => {
    try {
        const { FullName, Position, Email, Phone_no, Country, City, Gender, EPassword, Confirm_EPassword } = req.body;

        if (!FullName || !Position || !Email || !Phone_no || !Country || !City || !Gender || !EPassword || !Confirm_EPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const pool = await poolPromise;

        const emailCheck = await pool.request()
            .input("Email", sql.NVarChar, Email)
            .query('SELECT COUNT(*) as count FROM pat1.Registration WHERE Email = @Email');

        if (emailCheck.recordset[0].count > 0) {
            return res.status(409).json({ success: false, message: 'This email address is already registered.' });
        }

        const query = `
            INSERT INTO pat1.Registration (Fullname, Position, Email, Phone_no, Country, City, Gender, EPassword, Confirm_EPassword) 
            VALUES (@Fullname, @Position, @Email, @Phone_no, @Country, @City, @Gender, @EPassword, @Confirm_EPassword)`;

        const result = await pool.request()
            .input("Fullname", sql.VarChar, FullName)
            .input("Position", sql.VarChar, Position)
            .input("Email", sql.NVarChar, Email)
            .input("Phone_no", sql.VarChar, Phone_no)
            .input("Country", sql.VarChar, Country)
            .input("City", sql.VarChar, City)
            .input("Gender", sql.VarChar, Gender)
            .input("EPassword", sql.NVarChar, EPassword)
            .input("Confirm_EPassword", sql.NVarChar, Confirm_EPassword)
            .query(query);

        res.status(201).json({ success: true, message: 'Registration successful!', data: result.rowsAffected });
    }
    catch (error) {
        console.error('Error in POST /api/patientdetails:', error.message);
        res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
    }
});


// update a patient record 
app.put('/api/patientdetails/:ID', async (req, res) => {
    try {
        const { ID } = req.params;
        const { Fullname, Position, Email, Phone_no, Country, City, Gender, EPassword } = req.body;

        if (!Fullname || !Position || !Email || !Phone_no || !Country || !City || !Gender) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required profile fields.'
            });
        }

        const pool = await poolPromise;
        const request = pool.request();

        let query = 'UPDATE pat1.Registration SET Fullname=@Fullname, Position=@Position, Email=@Email, Phone_no=@Phone_no, Country=@Country, City=@City, Gender=@Gender';

        request.input("Fullname", sql.VarChar, Fullname);
        request.input("Position", sql.VarChar, Position);
        request.input("Email", sql.NVarChar, Email);
        request.input("Phone_no", sql.VarChar, Phone_no);
        request.input("Country", sql.VarChar, Country);
        request.input("City", sql.VarChar, City);
        request.input("Gender", sql.VarChar, Gender);

        if (EPassword) {
            query += ', EPassword=@EPassword, Confirm_EPassword=@Confirm_EPassword';
            request.input("EPassword", sql.NVarChar, EPassword);
            request.input("Confirm_EPassword", sql.NVarChar, EPassword);
        }

        query += ' WHERE ID = @ID';
        request.input("ID", sql.Int, ID);

        const result = await request.query(query);

        res.status(200).json({ success: true, message: 'Patient updated successfully!', data: result.rowsAffected });

    } catch (error) {
        console.error('Error in PUT /api/patientdetails/:ID:', error.message);
        res.status(500).json({ success: false, message: 'Server error during update.', error: error.message });
    }
});

//delete patient records by id
app.delete('/api/patientdetails/:ID', async (req, res) => {
    try {
        const { ID } = req.params;
        if (isNaN(ID)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }
        const pool = await poolPromise;
        const result = await pool.request().input("ID", sql.Int, ID).query('DELETE FROM pat1.Registration WHERE ID = @ID');
        console.log(result);
        res.status(200).json(result.rowsAffected);
    }
    catch (error) {
        console.log('Error', error);
        res.status(500).json(error.message);
    }
});
