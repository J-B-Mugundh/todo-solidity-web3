import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CriminalCaseFilingABI from './contracts/CriminalCaseFilingABI.json';
import './App.css';

function App() {
  const [cases, setCases] = useState([]);
  const [newCase, setNewCase] = useState({});

  useEffect(() => {
    async function fetchData() {
      await getCriminalCases();
    }
    fetchData();
  }, []);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const criminalCaseFilingContract = new ethers.Contract(
    process.env.REACT_APP_CRIMINAL_CASE_FILING_ADDRESS,
    CriminalCaseFilingABI,
    signer
  );

  const getCriminalCases = async () => {
    const count = await criminalCaseFilingContract.getCriminalCaseCount();
    const newCases = [];

    for (let i = 1; i <= count; i++) {
      const _case = await criminalCaseFilingContract.cases(i);
      newCases.push(_case);
    }

    setCases(newCases);
  };

  const createCase = async () => {
    const { hash } = await criminalCaseFilingContract.createCase(
      newCase.dateTimeOfIncident,
      newCase.location,
      newCase.victimName,
      newCase.suspectName,
      newCase.descriptionOfIncident,
      newCase.charges,
      newCase.arrestInformation,
      newCase.evidence
    );
    await provider.waitForTransaction(hash);
    await getCriminalCases();
    setNewCase({});
  };

  return (
    <div className="App">
      <h1>Criminal Case Filing System</h1>

      <div>
        <h2>Create New Case</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          createCase();
        }}>
          <div className="form-group">
            <label>Date and Time of Incident:</label>
            <input
              type="datetime-local"
              value={newCase.dateTimeOfIncident || ''}
              onChange={(e) => setNewCase({ ...newCase, dateTimeOfIncident: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              value={newCase.location || ''}
              onChange={(e) => setNewCase({ ...newCase, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Victim Name:</label>
            <input
              type="text"
              value={newCase.victimName || ''}
              onChange={(e) => setNewCase({ ...newCase, victimName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Suspect Name:</label>
            <input
              type="text"
              value={newCase.suspectName || ''}
              onChange={(e) => setNewCase({ ...newCase, suspectName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description of Incident:</label>
            <input
              type="text"
              value={newCase.descriptionOfIncident || ''}
              onChange={(e) => setNewCase({ ...newCase, descriptionOfIncident: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Charges:</label>
            <input
              type="text"
              value={newCase.charges || ''}
              onChange={(e) => setNewCase({ ...newCase, charges: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Arrest Information:</label>
            <input
              type="datetime-local"
              value={newCase.arrestInformation || ''}
              onChange={(e) => setNewCase({ ...newCase, arrestInformation: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Evidence:</label>
            <input
              type="text"
              value={newCase.evidence || ''}
              onChange={(e) => setNewCase({ ...newCase, evidence: e.target.value })}
            />
          </div>
          <button type="submit">Create Case</button>
        </form>
      </div>

      <div>
        <h2>Criminal Cases</h2>
        {cases.map((_case) => (
          <div key={_case.id}>
            <p>Case ID: {_case.id.toString()}</p>
            <p>Date and Time of Incident: {_case.dateTimeOfIncident.toString()}</p>
            <p>Location: {_case.location}</p>
            <p>Victim Name: {_case.victimName}</p>
            <p>Suspect Name: {_case.suspectName}</p>
            <p>Description of Incident: {_case.description}</p>
            <p>Charges: {_case.charges}</p>
            <p>Arrest Information: {_case.arrestInformation.toString()}</p>
            <p>Evidence: {_case.evidence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
