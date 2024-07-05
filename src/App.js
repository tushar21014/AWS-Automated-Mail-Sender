import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [emails, setEmails] = useState('');
    const [format, setFormat] = useState('format1');
    const [subject, setSubject] = useState('Application for Developer position at');
    const [companyName, setCompanyName] = useState('');
    const [companyPost, setCompanyPost] = useState('');
    const [companyPostURL, setCompanyPostURL] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/send-email', {
                emails,
                format,
                subject,
                companyName,
                companyPost,
                companyPostURL
            });
            alert('Email sent successfully!');
        } catch (error) {
            alert('Error sending email: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Email Sender</h1>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Emails (comma-separated):</label>
                            <input type="text" value={emails} style={{width:"80vw"}} onChange={(e) => setEmails(e.target.value)} required />
                        </div>
                        <div>
                            <label>Format:</label>
                            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                                <option value="format1">Specific application</option>
                                <option value="format2">Non Specific application</option>
                                <option value="format3">Not applied but review</option>
                            </select>
                        </div>
                        <div>
                            <label>Subject:</label>
                            <input type="text" value={subject} style={{width:"70vw"}} onChange={(e) => setSubject(e.target.value)} />
                        </div>
                        {format === 'format1' && (
                            <>
                                <div>
                                    <label>Company Name:</label>
                                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                </div>
                                <div>
                                    <label>Company Post:</label>
                                    <input type="text" value={companyPost} onChange={(e) => setCompanyPost(e.target.value)} />
                                </div>
                                <div>
                                    <label>Company Post URL:</label>
                                    <input type="text" value={companyPostURL} onChange={(e) => setCompanyPostURL(e.target.value)} />
                                </div>
                            </>
                        )}
                        {format === 'format3' && (
                            <>
                                <div>
                                    <label>Company Name:</label>
                                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                </div>
                                <div>
                                    <label>Company Post:</label>
                                    <input type="text" value={companyPost} onChange={(e) => setCompanyPost(e.target.value)} />
                                </div>
                                <div>
                                    <label>Company Post URL:</label>
                                    <input type="text" value={companyPostURL} onChange={(e) => setCompanyPostURL(e.target.value)} />
                                </div>
                            </>
                        )}
                        <button type="submit">Send Email</button>
                    </form>
                )}
            </header>
        </div>
    );
}

export default App;
