import React, { useState } from 'react';

const SupplierForm = () => {
    const [supplierName, setSupplierName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can handle form submission here (e.g., send data to an API)
        console.log({
            supplierName,
            contactPerson,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            country,
            paymentTerms,
            productDescription,
            notes,
        });
    };

    return (
        <div className="supplier-form">
            <h1>Supplier Registration Form</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Supplier Name:
                    <input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required />
                </label>
                <label>
                    Contact Person:
                    <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
                </label>
                <label>
                    Email Address:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Phone Number:
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </label>
                <label>
                    Address:
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </label>
                <label>
                    City:
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                </label>
                <label>
                    State:
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
                </label>
                <label>
                    Zip Code:
                    <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                </label>
                <label>
                    Country:
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
                </label>
                <label>
                    Payment Terms:
                    <input type="text" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} required />
                </label>
                <label>
                    Description of Products/Services:
                    <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} required></textarea>
                </label>
                <label>
                    Additional Notes:
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SupplierForm;
