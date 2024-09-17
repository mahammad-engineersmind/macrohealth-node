/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import express from "express";
import fetch from "node-fetch";

import config from "./util/configTreePath.js";
import {
  corsWithReady,
  liferayJWT,
} from "./util/liferay-oauth2-resource-server.js";
import { logger } from "./util/logger.js";

// const API_URL = "https://liferaypoc.sandbox.macrohealth.com";
const API_URL = "http://vpn:33000"

const serverPort = config["server.port"];
const app = express();

logger.log(`config: ${JSON.stringify(config, null, "\t")}`);

app.use(express.json());
app.use(corsWithReady);
// app.use(liferayJWT);

app.get(config.readyPath, (req, res) => {
  res.send("READY");
});

app.get("/api/customer", async (req, res) => {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }

  const url = `${API_URL}/api/customer`;

  const options = {
    method: "GET",
    headers: {
      'Host': 'liferaypoc.sandbox.macrohealth.com',
      Authorization: req.headers.authorization,
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).send(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.get("/api/expectedFiles/check", async (req, res) => {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }

  const url = `${API_URL}/api/expectedFiles/check`;

  const data = JSON.stringify({
    date: req.query.date,
  });

  const options = {
    method: "POST",
    headers: {
      'Host': 'liferaypoc.sandbox.macrohealth.com',
      Authorization: req.headers.authorization,
      "Content-Type": "application/json", // Ensure the Content-Type is set for JSON payloads
    },
    body: data,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    res.status(200).send(responseData);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.get("/test/api/customer", (req, res) => {
  res.status(200).send([
    {
      id: "e45ec3f1-5580-45fd-b6d3-f28c8391ad58",
      name: "Expectations Customer",
    },
    {
      id: "a4bbfb76-b0cc-4ce1-b244-b8a0dec59177",
      name: "Expectations Customer 2",
    },
  ]);
});

app.get("/test/api/expectedFiles/check", (req, res) => {
  res.status(200).send([
    {
      fileExpectation: {
        id: "7da45b8a-386d-4a8c-85b7-b8347a59b697",
        integrationId: "14bc946a-a691-42ae-a5f7-f9e91f3aca43",
        name: "FROM PARTNER 1 ACK",
        workstream: "Claims",
        party: "Partner 1",
        stepNumber: 2,
        direction: "out",
        expectedFrequency: "(Mo,Tu,We,Th,Fr) 18:00-20:00",
        timeZone: "US/Pacific",
        sftpFolder: "",
        filePattern: ".*.x12",
        consequence: "Call Support",
        numberOfFiles: "1",
        disabled: false,
      },
      expectationResult: "GREY",
      matches: [],
    },
    {
      fileExpectation: {
        id: "f93f3408-b4dc-4473-9d6c-51491cc542e8",
        integrationId: "14bc946a-a691-42ae-a5f7-f9e91f3aca43",
        name: "FROM PARTNER 1 CLAIMS",
        workstream: "Claims",
        party: "Partner 1",
        stepNumber: 1,
        direction: "in",
        expectedFrequency: "(Mo,Tu,We,Th,Fr) 18:00-20:00",
        timeZone: "US/Pacific",
        sftpFolder: "",
        filePattern: ".*.x12",
        consequence: "Call Support",
        numberOfFiles: "1",
        disabled: false,
      },
      expectationResult: "GREY",
      matches: [],
    },
    {
      fileExpectation: {
        id: "fda23d65-5e43-4c10-bf7e-1859ba747d9c",
        integrationId: "78fe98c7-bd7d-431e-8c57-63bed1e7d19b",
        name: "TO PARTNER 2 ENROLLMENT",
        workstream: "Enrollment",
        party: "Partner 2",
        stepNumber: 2,
        direction: "out",
        expectedFrequency: "(Mo,Tu,We,Th,Fr) 18:00-19:00",
        timeZone: "US/Pacific",
        sftpFolder: "",
        filePattern: ".*.x12",
        consequence: "Call Support",
        numberOfFiles: "1",
        disabled: false,
      },
      expectationResult: "GREY",
      matches: [],
    },
    {
      fileExpectation: {
        id: "3b8cf5e8-e119-4c58-947e-815941c44f16",
        integrationId: "78fe98c7-bd7d-431e-8c57-63bed1e7d19b",
        name: "FROM PARTNER 2 ENROLLMENTS",
        workstream: "Enrollment",
        party: "Partner 2",
        stepNumber: 1,
        direction: "in",
        expectedFrequency: "(Mo,Tu,We,Th,Fr) 18:00-19:00",
        timeZone: "US/Pacific",
        sftpFolder: "",
        filePattern: ".*.x12",
        consequence: "Call Support",
        numberOfFiles: "1",
        disabled: false,
      },
      expectationResult: "GREY",
      matches: [],
    },
  ]);
});

app.listen(serverPort, () => {
  logger.log(`App listening on ${serverPort}`);
});

export default app;
