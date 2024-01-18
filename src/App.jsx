import "./App.css";
import data from "../src/raw data/data.js";
import $ from "jquery";
import { useEffect, useState, useRef } from "react";

function App() {
  const [output, setOutput] = useState([]);
  const [hidden, setHidden] = useState(true);

  const reff = useRef();

  // assignments
  const securityScanResults = data;

  const resultArray = securityScanResults.reduce((acc, currentDevice) => {
    const { Customer_name, Device, Affected_files, ...otherDetails } =
      currentDevice;

    // Check if the customer already exists in the accumulator array
    const existingCustomer = acc.find(
      (customer) => customer.Customer_name === Customer_name
    );

    if (!existingCustomer) {
      // If the customer doesn't exist, push a new customer object into the array
      acc.push({
        Customer_name,
        devices: [
          {
            Device,
            ...otherDetails,
            Affected_files: Affected_files.split(";").map((file) =>
              file.trim()
            ),
          },
        ],
      });
    } else {
      // If the customer exists, check if the device exists
      const existingDevice = existingCustomer.devices.find(
        (device) => device.Device === Device
      );

      if (!existingDevice) {
        // If the device doesn't exist, add a new device to the existing customer's devices array
        existingCustomer.devices.push({
          Device,
          ...otherDetails,
          Affected_files: Affected_files.split(";").map((file) => file.trim()),
        });
      } else {
        // If the device exists, append affected files to the existing array
        existingDevice.Affected_files = existingDevice.Affected_files.concat(
          Affected_files.split(";").map((file) => file.trim())
        );
      }
    }

    return acc;
  }, []);

  useEffect(() => {
    setOutput(resultArray);
  }, []);

  function hide() {
    for (let i = 0; i < output.length; i++) {
      $(`${".details" + i}`).slideUp();
    }
  }

  return (
    <div className="">
      {output && (
        <>
          <div className="stat-value text-center mb-2">Threats and Devices</div>

          <div className="text-xs text-center">
            Data is imported from '/raw data/data.js'
          </div>
          <div className="text-xs text-center mb-5">
            Replace the data.js file with new data, assign the data in the file
            to the variable 'data' and export as default
          </div>

          <button className="btn btn-accent btn-outline btn-sm" onClick={hide}>
            Minimize All
          </button>

          {output?.map((i, index) => (
            <div key={index} className="mb-10 ">
              <div className="">
                <div>
                  <div
                    onClick={() => {
                      $(`${".details" + index}`).slideToggle();
                    }}
                    className="cursor-pointer bg-base-300 stat company hover:bg-base-200"
                  >
                    {index + 1} - {i.Customer_name}
                  </div>
                </div>

                {hidden && (
                  <div className={`${"details" + index}`}>
                    <div className="stat">
                      <div className="stat-title">Devices</div>
                      <div>
                        {i.devices.map((d, index) => (
                          <div key={index} className="mb-5 bg-base-100 stat">
                            <div className="text-accent font-bold">
                              {d.Device}
                            </div>
                            <div>
                              <div className="mt-1">
                                <span className="text-error">
                                  {d.Affected_files.length} Affected Files
                                </span>
                              </div>
                              {d.Affected_files.map((f, index) => (
                                <li key={index}>{f}</li>
                              ))}
                            </div>
                            <div>
                              <div className="text-accent">Detected By</div>
                              <div>{d.Detected_by}</div>
                            </div>
                            <div>
                              <div className="text-accent">Last_infected</div>
                              <div>{d.Last_infected}</div>
                            </div>
                            <div>
                              <div className="text-accent">Threat</div>
                              <div>{d.Threat}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
