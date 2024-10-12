import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf'; // Importing jsPDF library
import 'jspdf-autotable'; // Importing autotable plugin for jsPDF
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import logo from '../image/logo.png'; // Update the path as necessary
import backgr from '../image/bbk.png'; // Background image

const ResourcesRetrieve = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewResource, setViewResource] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/resource');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResources(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this resource?');
        if (confirmed) {
            try {
                await fetch(`/api/resource/${id}`, {
                    method: 'DELETE',
                });
                setResources(resources.filter(resource => resource._id !== id));
            } catch (error) {
                console.error('Error deleting resource:', error);
            }
        }
    };

    const handleView = (resource) => {
        setViewResource(resource);
    };

    const filteredResources = resources.filter(resource => {
        const matchesName = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = searchDate ? new Date(resource.date).toLocaleDateString() === new Date(searchDate).toLocaleDateString() : true;
        return matchesName && matchesDate;
    });

    // Function to generate PDF
    const downloadPDF = () => {
        const doc = new jsPDF();

        // Add Logo
        doc.addImage(logo, 'PNG', 14, 10, 50, 20); // Adjust the position and size as necessary

        // Add Title Next to Logo
        doc.setFontSize(18); // Set font size for the title
        doc.setFont("helvetica", "bold"); // Set font to bold
        doc.setTextColor(0, 51, 102); // Set color to a professional dark blue (RGB: 0, 51, 102)
        doc.text("Bear Works Lanka", 70, 20); // Position the title next to the logo

        // Draw Header Line
        doc.setDrawColor(0, 0, 0); // Set line color to black
        doc.line(14, 32, doc.internal.pageSize.width - 14, 32); // Draw line below the header

        // Reset font for the report title
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14); // Set font size for report title
        doc.setTextColor(0, 0, 0); // Set color to black
        doc.text('Resources List', 14, 50); // Position for report title

        // Prepare table columns and rows
        const tableColumn = ["Name", "Date", "Quantity"]; // Updated to exclude Unique ID
        const tableRows = [];

        filteredResources.forEach(resource => {
            const resourceData = [
                resource.name,
                new Date(resource.date).toLocaleDateString(),
                resource.quantity,
            ];
            tableRows.push(resourceData);
        });

        // Add Table
        doc.autoTable(tableColumn, tableRows, { startY: 60 }); // Start Y after title

        // Draw Footer Line
        const footerY = doc.internal.pageSize.height - 30; // Position for footer line
        doc.line(14, footerY, doc.internal.pageSize.width - 14, footerY); // Draw line above the footer

        // Add Footer
        doc.setFontSize(12); // Set font size for footer
        doc.setFont("helvetica", "normal"); // Set font to normal
        doc.setTextColor(0, 0, 0); // Set color to black
        const footerText = "Address: 123 Bear Lane, Colombo, Sri Lanka\nContact: +94 123 456 789"; // Sample footer text
        const footerLines = doc.splitTextToSize(footerText, doc.internal.pageSize.width - 28); // Split text to fit the page

        doc.text(footerLines, 14, footerY + 10); // Draw footer text below the footer line

        // Save the PDF
        doc.save("resources.pdf");
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-no-repeat bg-center" 
            style={{ backgroundImage: `url(${backgr})` }} // Apply background image
        >
            <Header />
            <div className="container mx-auto px-4 py-8 bg-white bg-opacity-80 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-black">Resources List</h1>

                {/* Search Inputs */}
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 justify-center">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* PDF Download Button */}
                <div className="mb-4 flex">
                    <button
                        onClick={downloadPDF}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-400"
                    >
                        Generate Report
                    </button>
                </div>

                {loading && <p className="text-center text-gray-600">Loading resources...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {filteredResources.length > 0 ? (
                    <div className="overflow-x-auto">
                        <div className="bg-red-50 rounded-lg shadow-lg mb-4 p-4 border border-gray-300">
                            <table className="min-w-full bg-white shadow-md rounded-lg">
                                <thead className="bg-gray-200">
                                    <tr className="text-black">
                                        <th className="py-2 px-4 text-left">Name</th>
                                        <th className="py-2 px-4 text-left">Date</th>
                                        <th className="py-2 px-4 text-left">Quantity</th>
                                        <th className="py-2 px-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResources.map(resource => (
                                        <tr key={resource._id} className="border-b hover:bg-gray-100">
                                            <td className="py-2 px-4">{resource.name}</td>
                                            <td className="py-2 px-4">{new Date(resource.date).toLocaleDateString()}</td>
                                            <td className="py-2 px-4">{resource.quantity}</td>
                                            <td className="py-2 px-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleView(resource)}
                                                    className="text-white bg-blue-500 rounded px-2 py-1 hover:bg-blue-600 transition duration-200"
                                                    aria-label={`View resource ${resource.name}`}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(resource._id)}
                                                    className="ml-2 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition duration-200"
                                                    aria-label={`Delete resource ${resource.name}`}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* View Modal */}
                        {viewResource && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4">Resource Details</h2>
                                    <p><strong>Name:</strong> {viewResource.name}</p>
                                    <p><strong>Date:</strong> {new Date(viewResource.date).toLocaleDateString()}</p>
                                    <p><strong>Quantity:</strong> {viewResource.quantity}</p>
                                    <button
                                        onClick={() => setViewResource(null)}
                                        className="mt-4 w-full bg-blue-500 text-black rounded px-2 py-2 hover:bg-blue-600 transition duration-200"
                                        aria-label="Close resource details"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No resources available.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ResourcesRetrieve;
