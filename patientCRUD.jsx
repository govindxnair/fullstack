import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const PatientCRUD = () => {
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        ID: '', Fullname: '', Position: 'Select Position', Email: '', Phone_no: '',
        Country: '', City: '', Gender: 'Male', EPassword: '', Confirm_EPassword: '',
    });
    const [phonePrefix, setPhonePrefix] = useState('+91');
    const [isEditing, setIsEditing] = useState(false);
    const [currentPatientId, setCurrentPatientId] = useState(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://localhost:5000/api/patientdetails';

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get(API_URL);
            const fetchedData = response.data.data || [];
            fetchedData.sort((a, b) => a.ID - b.ID);
            setPatients(fetchedData);
        } catch (error) {
            toast.error('Failed to fetch patients.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        if (name === "Fullname" || name === "Country" || name === "City") {
            processedValue = value.replace(/[^A-Za-z ]/g, '');
        } else if (name === "Phone_no") {
            processedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        }
        setFormData({ ...formData, [name]: processedValue });
    };

    const resetForm = () => {
        setFormData({
            ID: '', Fullname: '', Position: 'Select Position', Email: '', Phone_no: '',
            Country: '', City: '', Gender: 'Male', EPassword: '', Confirm_EPassword: ''
        });
        setPhonePrefix('+91');
        setIsEditing(false);
        setCurrentPatientId(null);
        setShowPasswordFields(false);
    };

    const handleEdit = (patient) => {
        setIsEditing(true);
        setCurrentPatientId(patient.ID);
        const phone = patient.Phone_no || "";
        const prefixMatch = phone.match(/^\+(91|1|44|61)\b/);
        const prefix = prefixMatch ? prefixMatch[0] : '+91';
        const number = phone.replace(prefix, '');
        setPhonePrefix(prefix);
        setFormData({
            ID: patient.ID, Fullname: patient.Fullname,
            Position: patient.Position || 'Select Position', Email: patient.Email,
            Phone_no: number, Country: patient.Country, City: patient.City,
            Gender: patient.Gender, EPassword: '', Confirm_EPassword: '',
        });
        setShowPasswordFields(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.Fullname || formData.Fullname.trim().length < 6) { toast.warn("Name should be at least 6 characters long."); return; }
        if (formData.Position === "Select Position") { toast.warn("Please select a position."); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) { toast.warn("Please enter a valid email address."); return; }
        if (formData.Phone_no.length !== 10) { toast.warn("Phone number must be exactly 10 digits."); return; }
        if (!formData.Country || !formData.City) { toast.warn("Please enter country and city."); return; }

        const dataToSubmit = { ...formData, Phone_no: `${phonePrefix}${formData.Phone_no}` };

        if (showPasswordFields && formData.EPassword) {
            if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/.test(formData.EPassword)) {
                toast.error("Password must be at least 5 characters and contain letters, numbers, and a special character.");
                return;
            }
            if (formData.EPassword !== formData.Confirm_EPassword) {
                toast.error("Passwords do not match.");
                return;
            }
        } else {
            delete dataToSubmit.EPassword;
            delete dataToSubmit.Confirm_EPassword;
        }

        try {
            await axios.put(`${API_URL}/${currentPatientId}`, dataToSubmit);
            toast.success('Patient updated successfully!');
            fetchPatients();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while updating the patient.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                toast.success('Patient deleted successfully!');
                fetchPatients();
            } catch (error) {
                toast.error('Failed to delete patient.');
            }
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.Fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <>
            <div className="container-fluid mt-4">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="row justify-content-center">

                    <div className="col-lg-7 mb-4 mb-lg-0">
                        <div className="customDiv h-100">
                            <h5 className="txt text-center mt-2 mb-3">PATIENT LIST</h5>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr><th>ID</th><th>Fullname</th><th>Position</th><th>Email</th><th>Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {filteredPatients.map((p) => (
                                            <tr key={p.ID}>
                                                <td>{p.ID}</td><td>{p.Fullname}</td><td>{p.Position}</td><td>{p.Email}</td>
                                                <td>
                                                    <button className="btn btn-danger btn-sm me-2" onClick={() => handleEdit(p)}>Edit</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.ID)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        {isEditing ? (
                            <div className="edit-form-wrapper h-100">
                                <div className="background2">
                                    <h5 className="txt text-center mt-2 mb-3">EDIT PATIENT</h5>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-2 mb-2">
                                            <div className="col"><label className="form-label small">ID</label><input name="ID" type="number" className="form-control form-control-sm" value={formData.ID} disabled /></div>
                                            <div className="col"><label className="form-label small">Name</label><input name="Fullname" type="text" className="form-control form-control-sm" value={formData.Fullname} onChange={handleInputChange} required /></div>
                                        </div>
                                        <div className="row g-2 mb-2">
                                            <div className="col"><label className="form-label small">Position</label><select name="Position" className="form-select form-select-sm" value={formData.Position} onChange={handleInputChange}><option>Select Position</option><option value="Software Engineer">Software Engineer</option><option value="Data Scientist">Data Scientist</option><option value="Product Manager">Product Manager</option><option value="UX Designer">UX Designer</option></select></div>
                                            <div className="col"><label className="form-label small">Email</label><input name="Email" type="email" className="form-control form-control-sm" value={formData.Email} onChange={handleInputChange} required /></div>
                                        </div>
                                        <div className="row g-2 mb-2">
                                            <div className="col"><label className="form-label small">Phone No</label><div className="input-group input-group-sm"><button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{phonePrefix}</button><ul className="dropdown-menu">{['+91', '+1', '+44', '+61'].map(prefix => (<li key={prefix}><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setPhonePrefix(prefix); }}>{prefix}</a></li>))}</ul><input name="Phone_no" type="text" className="form-control" maxLength="10" value={formData.Phone_no} onChange={handleInputChange} required /></div></div>
                                            <div className="col"><label className="form-label small">Country</label><input name="Country" type="text" className="form-control form-control-sm" value={formData.Country} onChange={handleInputChange} required /></div>
                                        </div>
                                        <div className="row g-2 mb-2">
                                            <div className="col"><label className="form-label small">City</label><input name="City" type="text" className="form-control form-control-sm" value={formData.City} onChange={handleInputChange} required /></div>
                                            <div className="col"><label className="form-label small">Gender
                                            </label><div className="d-flex mt-1">{['Male', 'Female', 'Other'].map(g => (<div className="form-check form-check-inline" key={g}><input className="form-check-input" type="radio" name="Gender" value={g} checked={formData.Gender === g} onChange={handleInputChange} /><label className="form-check-label small">{g}</label></div>))}</div></div>
                                        </div>



                                        {showPasswordFields ? (
                                            <>
                                                <div className="row g-2 mb-2">
                                                    <div className="col"><label className="form-label small">New Password</label><input name="EPassword" type="password" className="form-control form-control-sm" value={formData.EPassword} onChange={handleInputChange} placeholder="Enter New Password" autoComplete="new-password" /></div>
                                                </div>
                                                <div className="row g-2 mb-2">
                                                    <div className="col"><label className="form-label small">Confirm Password</label><input name="Confirm_EPassword" type="password" className="form-control form-control-sm" value={formData.Confirm_EPassword} onChange={handleInputChange} placeholder="Confirm New Password" autoComplete="new-password" /></div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <button type="button" className="btn2 btn-link" onClick={() => setShowPasswordFields(true)}>
                                                    Change Password
                                                </button>
                                            </div>
                                        )}

                                        <div className="d-grid gap-3 mt-3">
                                            <button className="btn1" type="submit">Update</button>
                                            <button className="btn1" type="button" onClick={resetForm}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="placeholder-card h-100">
                                <div className="text-center">
                                    <h4 className="text-muted">Edit Patient Details</h4>
                                    <p className="text-secondary mt-2">To modify a patient's information, please click the "Edit" button in the list.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientCRUD;
