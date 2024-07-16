import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUpRightAndDownLeftFromCenter,
  faDownLeftAndUpRightToCenter,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

import { Button, Accordion } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import FormInput from "./components/CompanyInputs";

import TimeAndDateComponent from "./components/TimeAndDateComponent";
import EmailModal from "./components/EmailModal";
import { Form } from "react-bootstrap";
import DropdownMenuForFormats from "./components/DropdownComp";

import Avvvatars from "avvvatars-react";

import { generate, count } from "random-words";

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

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [barWidth, setBarWidth] = useState("25vw"); // Initial width of the sidebar
  const [isCollapsed, setIsCollapsed] = useState(false); // State to track if sidebar is collapsed

  const handleUpdateClick = (index) => {
    setSelectedEmail({ ...scheduledEmails[index], index });
  };

  const deleteScheduledEmail = async (index) => {
    try {
      const response = await fetch(`${api}/delete-scheduled-email/${index}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success(`Scheduled email has been deleted!`);
        fetchScheduledEmails();

        // Optionally, refresh the list of scheduled emails here
      } else {
        toast.error("Failed to delete the scheduled email.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while trying to delete the scheduled email."
      );
    }
  };

  // Check if the sendImmediately checkbox is checked
  const [sendImmediately, setSendImmediately] = useState(false);

  function customToast(message) {
    return toast.custom((t) => (
      <button
        disabled
        type="button"
        class="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
      >
        <svg
          aria-hidden="true"
          role="status"
          class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2"
          />
        </svg>
        {message}
      </button>
    ));
  }
  // Acces the api from env file
  // const api = "http://localhost:3001"
  const api = process.env.REACT_APP_API_URL;

  const promiseHandler = (submitFunction) => {
    toast.promise(submitFunction, {
      loading: "Sending...",
      success: (
        <b>Mail {sendImmediately ? "sent" : "scheduled"} successfully.</b>
      ),
      error: <b>Failed to {sendImmediately ? "sent" : "scheduled"} mail.</b>,
    });
  };

  // Send the email immediately on form submission (without scheduling)
  const handleSubmitImmediately = async (e) => {
    e.preventDefault();
    const toastId = customToast("Sending...");
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
      toast.dismiss(toastId.id);
      // Throw a new error or handle it appropriately
      toast.error("Error scheduling email. ");
      console.error("Failed to schedule mail");
    } finally {
      toast.dismiss(toastId.id);
      setLoading(false);
    }
    toast.success("Mail scheduled successfully");
  };

  const handleSubmitScheduled = async (e, newScheduleTime) => {
    e.preventDefault();
    const toastId = customToast("Sending...");
    try {
      await axios.post(api + "/schedule-email", {
        emails,
        format,
        subject,
        companyName,
        companyPost,
        companyPostURL,
        scheduleTime: newScheduleTime,
      });
      await fetchScheduledEmails(); // Wait for fetching scheduled emails to complete
    } catch (error) {
      toast.dismiss(toastId.id);
      // Throw a new error or handle it appropriately
      toast.error("Error scheduling email. ");
      console.error("Failed to schedule mail");
    } finally {
      toast.dismiss(toastId.id);
      setLoading(false);
    }
    toast.success("Mail scheduled successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (sendImmediately) {
        return handleSubmitImmediately(e);
      }

      // Combine date and time into a single string in the format: second (optional), minute, hour, day of month, month, day of week
      const newScheduleTime = `${time.split(":")[1]} ${time.split(":")[0]} ${
        date.split("-")[2]
      } ${date.split("-")[1]} *`;

      console.log("scheduleTime:", newScheduleTime);
      setScheduleTime(newScheduleTime);

      // Update handleSubmitScheduled to use the newScheduleTime instead of state
      handleSubmitScheduled(e, newScheduleTime);
    } catch (error) {
      toast.error("Error scheduling email: " + error.message);
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



  const toggleBar = () => {
    if (isCollapsed) {
      setBarWidth("25vw"); // Expand the sidebar width
    } else {
      setBarWidth("7vw"); // Collapse the sidebar width
    }
    setIsCollapsed(!isCollapsed); // Toggle the collapsed state
  };

  return (
    <div className="App">
      <Toaster />
      <EmailModal
        show={show}
        handleClose={handleClose}
        selectedEmail={selectedEmail}
        handleUpdateSubmit={handleSubmit}
      />
      <section className="container">
        <header className="App-header">
          <h1>Email Scheduler</h1>
        </header>

          <form className="form form-group" onSubmit={handleSubmit}>
            <FormInput
              value={emails}
              onChange={setEmails}
              className="form-control"
              label={"Emails (comma-separated):"}
              placeholder={"e.g. abc@google.com, xyz@microsoft.com"}
            />

            <DropdownMenuForFormats
              format={format}
              handleFormatChange={handleFormatChange}
            />

            <div className="input-box">
              <label>Subject:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            {["format1", "format2", "format3"].includes(format) && (
              <>
                <div className="column">
                  <FormInput
                    value={companyName}
                    onChange={setCompanyName}
                    label={"Company Name:"}
                    placeholder="e.g. Google"
                  />
                  {["format1", "format3"].includes(format) && (
                    <>
                      <FormInput
                        value={companyPost}
                        onChange={setCompanyPost}
                        label={"Company Post:"}
                        placeholder="e.g. Software Developer"
                      />
                      <FormInput
                        value={companyPostURL}
                        onChange={setCompanyPostURL}
                        label={"Company Post URL:"}
                        placeholder="e.g. https://careers.google.com/"
                      />
                    </>
                  )}
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

            <TimeAndDateComponent
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              sendImmediately={sendImmediately}
            />
          </form>
      </section>

      <aside className="App-aside " id="appAsideBar" style={{ width: barWidth }}>
        <div onClick={toggleBar} className="hover:cursor-pointer w-fit">
          {isCollapsed ? (
            <FontAwesomeIcon
              icon={faUpRightAndDownLeftFromCenter}
              className="transition-all delay-100 duration-500 ease-in-out m-2"
            />
          ) : (
            <FontAwesomeIcon
              icon={faDownLeftAndUpRightToCenter}
              className="transition-all delay-100 duration-500 ease-in-out m-2"
            />
          )}
        </div>
        {!isCollapsed ? (
          <>
            <div className="h4 text-center">Upcoming Scheduled Emails</div>
          </>
        ) : (
          <></>
        )}
        <div id="scheduled-emails">
          {scheduledEmails.length === 0 ? (
            <>
              {!isCollapsed ? (
                <>
                  <div className="my-3">
                    {/* Display a message when there are no scheduled emails */}
                    There are no scheduled emails.
                  </div>
                  <div className="emptyMailbox">
                    {/* Placeholder for empty mailbox */}
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              {!isCollapsed &&
                scheduledEmails.map((email, index) => (
                  <div key={index}>
                    <Accordion className="my-3">
                      <Accordion.Item eventKey={index}>
                        <Accordion.Header>
                          <div className=" flex items-center justify-start flex-row w-full">
                            <div className="w-fit mr-[15px]">
                              {/* Avatar */}
                              {email.companyName ? (
                                <Avvvatars value={email.companyName} />
                              ) : (
                                <Avvvatars style="shape" value={generate()} />
                              )}
                            </div>
                            <div className="">
                              {email.companyName}
                              <br />
                              <span
                                style={{ fontSize: "12px" }}
                                className="d-flex justify-content-space-between"
                              >
                                {email.scheduleTime
                                  .split(" ")
                                  .slice(0, 2)
                                  .reverse()
                                  .join(":")}{" "}
                                &nbsp;&nbsp;
                                {email.scheduleTime
                                  .split(" ")
                                  .slice(2, 4)
                                  .join("-")}
                                -2024
                              </span>
                            </div>
                            <div className="col-2"></div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body
                          style={{ paddingBottom: "0px", paddingLeft: "0.9vw" }}
                        >
                          <b> Subject : </b> {email.subject} <br />
                          <b>To:</b>
                          <div className="h-20 overflow-scroll no-scrollbar">
                            {email.emails}
                          </div>
                        </Accordion.Body>

                        <div className="w-full flex flex-row">
                          <button
                            className="delete-button"
                            type="button"
                            onClick={() => deleteScheduledEmail(index)}
                          >
                            <span className="button__text">Delete</span>
                            <span className="button__icon">
                              <FontAwesomeIcon icon={faTrash} color="white" />
                            </span>
                          </button>

                          <button
                            className="delete-button delete-update-button"
                            type="button"
                            onClick={() => {
                              handleShow();
                              handleUpdateClick(index);
                            }}
                          >
                            <span className="button__text">Update</span>
                            <span className="button__icon">
                              <FontAwesomeIcon icon={faPen} color="white" />
                            </span>
                          </button>
                        </div>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                ))}

              {isCollapsed && (
                
                // <div className="mt-4 flex flex-col align-middle">
                <div className="mt-4 d-flex align-items-center justify-content-center">
                  {scheduledEmails.map((email, index) => (
                    <div key={index} className="flex justify-center">
                      {email.companyName ? (
                        <Avvvatars size={42} value={email.companyName} borderSize={2} borderColor="#FFF"/>
                      ) : (
                        <Avvvatars size={42} style="shape" value={generate()} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

export default App;
