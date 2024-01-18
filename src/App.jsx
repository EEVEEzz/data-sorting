import "./App.css";
import data from "../src/raw data/data.js";
import { useEffect, useState } from "react";

function App() {
  const [input, setInputs] = useState(data);
  const [output, setOutput] = useState();

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

  console.log(resultArray);

  useEffect(() => {
    setOutput(resultArray);
  }, [input]);

  return (
    <div>
      {input ? (
        <>
          <div>Data Sorting</div>

          <div className="text-xs">Data is imported from '/raw data/data.js'</div>
          <div className="text-xs">Replace the data.js file with new data</div>

          {output?.map((i, index) => (
            <div className="mb-10 ">
              <div className="">
                <div className="bg-base-300 pt-10 pl-10 pr-10 pb-2">
                  <div className="font-bold text-error">
                    {index + 1} - {i.Customer_name}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Devices</div>
                  <div>
                    {i.devices.map((d) => (
                      <div className="mb-5 bg-base-100 stat">
                        <li className="text-primary font-bold">{d.Device}</li>
                        <div>
                          <div className="mt-1 text-primary">
                            Affected Files
                          </div>
                          {d.Affected_files.map((f) => (
                            <li>{f}</li>
                          ))}
                        </div>
                        <div>
                          <div className="text-primary">Detected By</div>
                          <div>{d.Detected_by}</div>
                        </div>
                        <div>
                          <div className="text-primary">Last_infected</div>
                          <div>{d.Last_infected}</div>
                        </div>
                        <div>
                          <div className="text-primary">Threat</div>
                          <div>{d.Threat}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div>Loading</div>
        </>
      )}
    </div>
  );
}

export default App;
