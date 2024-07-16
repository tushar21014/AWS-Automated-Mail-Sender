const DropdownMenuForFormats = ({ format, handleFormatChange }) => {
    return (
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
                  {format === "format1"
                    ? "Specific application"
                    : format === "format2"
                    ? "Non Specific application"
                    : "Not applied but review"}
                </button>
                <div className="dropdown-menu" aria-labelledby="formatDropdown">
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() =>
                      handleFormatChange({ target: { value: "format1" } })
                    }
                  >
                    Specific application
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() =>
                      handleFormatChange({ target: { value: "format2" } })
                    }
                  >
                    Non Specific application
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() =>
                      handleFormatChange({ target: { value: "format3" } })
                    }
                  >
                    Not applied but review
                  </a>
                </div>
              </div>
            </div>
    )
}

export default DropdownMenuForFormats;