import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


/**
 * The main component of the email scheduler application.
 *
 * @returns {JSX.Element} The JSX element representing the App component.
 */

function App() {
    const [emails, setEmails] = useState("");
    const [format, setFormat] = useState("format1");
    const [subject, setSubject] = useState(
        "Application for Developer position at"
    );
    const [companyName, setCompanyName] = useState("");
    const [companyPost, setCompanyPost] = useState("");
    const [companyPostURL, setCompanyPostURL] = useState("");
    const [loading, setLoading] = useState(false);
    const [scheduledEmails, setScheduledEmails] = useState([]);

    const [scheduleTime, setScheduleTime] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [barWidth, setBarWidth] = useState("20vw"); // Initial width of the sidebar
    const [isCollapsed, setIsCollapsed] = useState(false); // State to track if sidebar is collapsed


    // Check if the sendImmediately checkbox is checked
    const [sendImmediately, setSendImmediately] = useState(false);

    // Acces the api from env file
    // const api = "http://localhost:3001"
    const api = process.env.REACT_APP_API_URL;

    const promiseHandler = (submitFunction) => {
        toast.promise(
            submitFunction,
            {
                loading: 'Sending...',
                success: <b>Mail {sendImmediately ? "sent" : "scheduled"} successfully.</b>,
                error: <b>Failed to {sendImmediately ? "sent" : "scheduled"} mail.</b>,
            }
        );
    };

    // Send the email immediately on form submission (without scheduling)
    const handleSubmitImmediately = async (e) => {
        e.preventDefault();

        try {
            await axios.post(api + "/send-email", {
                emails,
                format,
                subject,
                companyName,
                companyPost,
                companyPostURL,
            });
        } catch (error) {
            throw new error('Failed to send mail');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitScheduled = async (e) => {
        e.preventDefault();
        try {
            await axios.post(api + "/schedule-email", {
                emails,
                format,
                subject,
                companyName,
                companyPost,
                companyPostURL,
                scheduleTime,
            });
            await fetchScheduledEmails(); // Wait for fetching scheduled emails to complete
        } catch (error) {
            console.error('Failed to schedule mail:', error);
            // Throw a new error or handle it appropriately
            throw new Error('Failed to schedule mail');
        } finally {
            setLoading(false);
        }
    };
    
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
            const response = await axios.get(api + "/scheduled-emails");
            setScheduledEmails(response.data);
        } catch (error) {
            console.error("Error fetching scheduled emails:", error);
        }
    };

    const handleFormatChange = (e) => {
        setFormat(e.target.value);
    };


    useEffect(() => {
        fetchScheduledEmails();
    }, []);

    const collapseBar = () => {
        var bar = document.getElementById('appAsideBar')
        bar.style.width = "5vw"
    }

    const toggleBar = () => {
        if (isCollapsed) {
            setBarWidth("20vw"); // Expand the sidebar width
        } else {
            setBarWidth("5vw"); // Collapse the sidebar width
        }
        setIsCollapsed(!isCollapsed); // Toggle the collapsed state
    };

    return (
        <div className="App">
            <Toaster />
            <section className="container">
                <header className="App-header">
                    <h1>Email Scheduler</h1>
                </header>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input-box">
                            <label>Emails (comma-separated):</label>
                            <input
                                type="text"
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                                placeholder="Enter email addresses separated by commas"
                                required
                            />
                        </div>
                        <div className="input-box">
                            <label>Format:</label>
                            {/* Bootstrap dropdown for Format selection */}
                            <div className="dropdown" style={{ width: "25vw" }}>
                                <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    id="formatDropdown"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    {format === 'format1' ? 'Specific application' :
                                        format === 'format2' ? 'Non Specific application' :
                                            'Not applied but review'
                                    }
                                </button>
                                <div className="dropdown-menu" aria-labelledby="formatDropdown">
                                    <a className="dropdown-item" href="#" onClick={() => handleFormatChange({ target: { value: 'format1' } })}>Specific application</a>
                                    <a className="dropdown-item" href="#" onClick={() => handleFormatChange({ target: { value: 'format2' } })}>Non Specific application</a>
                                    <a className="dropdown-item" href="#" onClick={() => handleFormatChange({ target: { value: 'format3' } })}>Not applied but review</a>
                                </div>
                            </div>
                        </div>
                        <div className="input-box">
                            <label>Subject:</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        {["format1", "format3"].includes(format) && (
                            <>
                                <div className="column">
                                    <div className="input-box">
                                        <label>Company Name:</label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <label>Company Post:</label>
                                        <input
                                            type="text"
                                            value={companyPost}
                                            onChange={(e) => setCompanyPost(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <label>Company Post URL:</label>
                                        <input
                                            type="text"
                                            value={companyPostURL}
                                            onChange={(e) => setCompanyPostURL(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Add a checkbox to allow the user to send the email immediately */}

                        <label className="CheckBoxContainer">
                            <input
                                type="checkbox"
                                id="sendImmediately"
                                name="sendImmediately"
                                checked={sendImmediately}
                                onChange={(e) => setSendImmediately(e.target.checked)}
                            />
                            <label htmlFor="sendImmediately">Send email immediately</label>
                            <div className="checkmark"></div>
                        </label>
                        <div>
                            <label>Schedule Time (cron format, IST):</label>
                        </div>
                        <div className="column">
                            <div className="input-box">
                                <label>Date:</label>
                                {/* If the checkbox is checked, disable the date and time inputs */}
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required={sendImmediately ? false : true}
                                    disabled={sendImmediately}
                                />
                            </div>
                            <div className="input-box">
                                <label>Time:</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required={sendImmediately ? false : true}
                                    disabled={sendImmediately}
                                />
                            </div>
                        </div>
                        <button type="submit">Schedule Email</button>
                    </form>
                )}
            </section>

            <aside className="App-aside" id="appAsideBar" style={{ width: barWidth }}>
                <div onClick={toggleBar}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                {!isCollapsed?<>
                <div className="h4 text-center">Upcoming Scheduled Emails</div>
                </>:<></>}
                <div id="scheduled-emails">
                    {scheduledEmails.length === 0 ? (
                        <>
                        {!isCollapsed?<>
                            <div className="my-3">
                                {/* Display a message when there are no scheduled emails */}
                                There are no scheduled emails.
                            </div>
                            <div className="emptyMailbox">
                                {/* Placeholder for empty mailbox */}
                            </div>

                            </>:<></>}

                        </>
                    ) : (
                        <>
                            {scheduledEmails.map((email, index) => (
                                <div key={index} className="email-item">
                                    <strong>Subject:</strong> {email.subject}
                                    <br />
                                    <strong>To:</strong> {email.emails}
                                    <br />
                                    {/* Convert cron format to human-readable format */}
                                    <strong>Scheduled Date:</strong>{" "}
                                    {email.scheduleTime.split(" ").slice(2, 4).join("-")}
                                    <br />
                                    <strong>Scheduled Time:</strong>{" "}
                                    {email.scheduleTime.split(" ").slice(0, 2).reverse().join(":")}
                                    <br />
                                    <strong>Company Name:</strong> {email.companyName}
                                    <br />
                                    <strong>Company Post:</strong> {email.companyPost}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </aside>
        </div>
    );
}

export default App;