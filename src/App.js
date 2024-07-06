import React, { useState, useEffect } from 'react';
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
    const [scheduledEmails, setScheduledEmails] = useState([]);
    
    
    const [scheduleTime, setScheduleTime] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    // Check if the sendImmediately checkbox is checked
    const [sendImmediately, setSendImmediately] = useState(false);

    // Acces the api from env file
    const api = process.env.REACT_APP_API_URL;


    // Send the email immediately on form submission (without scheduling) 
    const handleSubmitImmediately = async (e) => {
        e.preventDefault();

        try {
            await axios.post(api + '/send-email', {
                emails,
                format,
                subject,
                companyName,
                companyPost,
                companyPostURL
            });
            alert('Email sent successfully!');
        }
        catch (error) {
            alert('Error sending email: ' + error.message);
        }
        finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (sendImmediately) {
            return handleSubmitImmediately(e);
        }

        // Combine date and time into a single string in the format: second (optional), minute, hour, day of month, month, day of week 
        const scheduleTime = `${time.split(':')[1]} ${time.split(':')[0]} ${date.split('-')[2]} ${date.split('-')[1]} *`;

        console.log('scheduleTime:', scheduleTime);

        try {
            await axios.post(api+'/schedule-email', {
                emails,
                format,
                subject,
                companyName,
                companyPost,
                companyPostURL,
                scheduleTime
            });
            alert('Email scheduled successfully!');
            fetchScheduledEmails(); // Refresh the scheduled emails list
        } catch (error) {
            alert('Error scheduling email: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchScheduledEmails = async () => {
        try {
            const response = await axios.get('http://localhost:3001/scheduled-emails');
            setScheduledEmails(response.data);
        } catch (error) {
            console.error('Error fetching scheduled emails:', error);
        }
    };

    useEffect(() => {
        fetchScheduledEmails();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Email Scheduler</h1>
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
                        {['format1', 'format3'].includes(format) && (
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

                        {/* Add a checkbox to allow the user to send the email immediately */}
                        <div>
                            <input type="checkbox" id="sendImmediately" name="sendImmediately" checked={sendImmediately} onChange={(e) => setSendImmediately(e.target.checked)} />
                            <label htmlFor="sendImmediately">Send email immediately</label>
                        </div>

                        <div>
                            <label>Schedule Time (cron format, IST):</label>
                            {/* <input type="text" value={scheduleTime} style={{width:"70vw"}} onChange={(e) => setScheduleTime(e.target.value)} placeholder="e.g. '0 9 * * *' for 9 AM daily" required /> */}
                        </div>
                        <div>
                            <label>Date:</label>
                            {/* If the checkbox is checked, disable the date and time inputs */}
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required={sendImmediately ? false : true} disabled={sendImmediately} />
                        </div>
                        <div>
                            <label>Time:</label>
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required={sendImmediately ? false : true} disabled={sendImmediately} />
                        </div>
                        <button type="submit">Schedule Email</button>
                    </form>
                )}
            </header>
            <aside className="App-aside">
                <h2>Upcoming Scheduled Emails</h2>
                <div id="scheduled-emails">
                    {scheduledEmails.map((email, index) => (
                        <div key={index} className="email-item">
                            <strong>Subject:</strong> {email.subject}<br />
                            <strong>To:</strong> {email.emails}<br />
                            {/*  convert the cron format: second (optional), minute, hour, day of month, month, day of week (Scheduled Time: 29 00 07 07 *)  to a human-readable format */}
                            <strong>Scheduled Date:</strong> {email.scheduleTime.split(' ').slice(2, 4).join('-')}<br />
                            <strong>Scheduled Time:</strong> {email.scheduleTime.split(' ').slice(0, 2).reverse().join(':')}<br />
                            <strong>Company Name:</strong> {email.companyName}<br />
                            <strong>Company Post:</strong> {email.companyPost}
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}

export default App;

