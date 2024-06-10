import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import StudentInformationSystemABI from './utils/StudentInformationSystem.json'; // Import the ABI of your smart contract

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [usn, setUsn] = useState('');
  const [name, setName] = useState('');
  const [minor, setMinor] = useState('');
  const [usnToUpdateAttendance, setUsnToUpdateAttendance] = useState('');
  const [courseToUpdateAttendance, setCourseToUpdateAttendance] = useState('');
  const [attendanceToUpdate, setAttendanceToUpdate] = useState('');
  const [usnToUpdateGrade, setUsnToUpdateGrade] = useState('');
  const [courseToUpdateGrade, setCourseToUpdateGrade] = useState('');
  const [gradeToUpdate, setGradeToUpdate] = useState('');
  const [usnToFetch, setUsnToFetch] = useState('');
  const [courseToFetchAttendance, setCourseToFetchAttendance] = useState('');
  const [courseToFetchGrade, setCourseToFetchGrade] = useState('');
  // const [studentInfo, setStudentInfo] = useState(null);
  // const [studentAttendance, setStudentAttendance] = useState(null);
  // const [studentGrade, setStudentGrade] = useState(null);
  // const [alertMessage, setAlertMessage] = useState(null);
  // const [alertType, setAlertType] = useState(null);
  const [alertMessageAddStudent, setAlertMessageAddStudent] = useState(null);
  const [alertTypeAddStudent, setAlertTypeAddStudent] = useState(null);
  const [alertMessageUpdateAttendance, setAlertMessageUpdateAttendance] = useState(null);
  const [alertTypeUpdateAttendance, setAlertTypeUpdateAttendance] = useState(null);
  const [alertMessageUpdateGrade, setAlertMessageUpdateGrade] = useState(null);
  const [alertTypeUpdateGrade, setAlertTypeUpdateGrade] = useState(null);
  const [alertMessageFetchUSNs, setAlertMessageFetchUSNs] = useState(null);
  const [alertTypeFetchUSNs, setAlertTypeFetchUSNs] = useState(null);
  const [alertMessageFetchAttendance, setAlertMessageFetchAttendance] = useState(null);
  const [alertTypeFetchAttendance, setAlertTypeFetchAttendance] = useState(null);
  const [alertMessageFetchGrade, setAlertMessageFetchGrade] = useState(null);
  const [alertTypeFetchGrade, setAlertTypeFetchGrade] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Get the list of accounts
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          console.log('Accounts:', accounts);

          // Load the deployed contract
          const networkId = await web3Instance.eth.net.getId();
          console.log('Network ID:', networkId);
          
          const contractAddress = '0x79083be3c4620D0C803eb07c7f65eBe0793827a1'; // Replace with your deployed contract address
          const contractInstance = new web3Instance.eth.Contract(
            StudentInformationSystemABI.abi,
            contractAddress
          );
          setContract(contractInstance);
          console.log('Contract instance:', contractInstance);

        } catch (error) {
          console.error('Error connecting to blockchain', error);
        }
      } else {
        console.error('Please install MetaMask!');
      }
    };

    loadBlockchainData();
  }, []);


  const displayMessage = (message, type, setMessageState, setTypeState) => {
    setMessageState(message);
    setTypeState(type);
    setTimeout(() => {
      setMessageState(null);
      setTypeState(null);
    }, 5000); // Display alert for 5 seconds
  };

  const addStudent = async () => {
  try {
    if (!contract) {
      console.error('Contract not loaded yet.');
      return;
    }

    // Convert ETH amount to wei (e.g., 0.01 ETH to wei)
    const ethAmount = web3.utils.toWei('0.00001', 'ether');

    // Call the addStudent function with the input values and send ETH
    await contract.methods.addStudent(usn, name, minor).send({ from: accounts[0], value: ethAmount });
    console.log('Student added successfully!');

    displayMessage('Student added successfully!', 'success', setAlertMessageAddStudent, setAlertTypeAddStudent);
  } catch (error) {
    console.error('Error adding student', error);
    displayMessage('Error adding student', 'error', setAlertMessageAddStudent, setAlertTypeAddStudent);
  }
};
const updateAttendance = async () => {
    try {
      if (!contract) {
        console.error('Contract not loaded yet.');
        return;
      }

      await contract.methods.updateAttendance(usnToUpdateAttendance, courseToUpdateAttendance, attendanceToUpdate).send({ from: accounts[0] });

      console.log('Attendance updated successfully!');

      displayMessage('Attendance updated successfully!', 'success', setAlertMessageUpdateAttendance, setAlertTypeUpdateAttendance);
    } catch (error) {
      console.error('Error updating attendance', error);
      displayMessage('Error updating attendance', 'error', setAlertMessageUpdateAttendance, setAlertTypeUpdateAttendance);
    }
  };

  const updateGrade = async () => {
    try {
      if (!contract) {
        console.error('Contract not loaded yet.');
        return;
      }

      await contract.methods.updateGrade(usnToUpdateGrade, courseToUpdateGrade, gradeToUpdate).send({ from: accounts[0] });

      console.log('Grade updated successfully!');

      displayMessage('Grade updated successfully!', 'success', setAlertMessageUpdateGrade, setAlertTypeUpdateGrade);
    } catch (error) {
      console.error('Error updating grade', error);
      displayMessage('Error updating grade', 'error', setAlertMessageUpdateGrade, setAlertTypeUpdateGrade);
    }
  };

  const fetchStudentUSNs = async () => {
    try {
      if (!contract) {
        console.error('Contract not loaded yet.');
        return;
      }

      const usns = await contract.methods.getStudentUSNs().call();

      console.log('Student USNs:', usns);
      const usnsString = usns.join(', ');
      displayMessage('Student USNs: ' + usnsString, 'success', setAlertMessageFetchUSNs, setAlertTypeFetchUSNs);
    } catch (error) {
      console.error('Error fetching student USNs', error);
      displayMessage('Error fetching student USNs', 'error', setAlertMessageFetchUSNs, setAlertTypeFetchUSNs);
    }
  };

  const fetchStudentAttendance = async () => {
    try {
      if (!contract) {
        console.error('Contract not loaded yet.');
        return;
      }

      const attendance = await contract.methods.getStudentAttendance(usnToFetch, courseToFetchAttendance).call();

      console.log('Student Attendance:', attendance);

      displayMessage('Student Attendance: ' + attendance, 'success', setAlertMessageFetchAttendance, setAlertTypeFetchAttendance);
    } catch (error) {
      console.error('Error fetching student attendance', error);
      displayMessage('Error fetching student attendance', 'error', setAlertMessageFetchAttendance, setAlertTypeFetchAttendance);
    }
  };

  const fetchStudentGrade = async () => {
    try {
      if (!contract) {
        console.error('Contract not loaded yet.');
        return;
      }

      const grade = await contract.methods.getStudentGrade(usnToFetch, courseToFetchGrade).call();

      console.log('Student Grade:', grade);
      displayMessage('Student Grade: ' + grade, 'success', setAlertMessageFetchGrade, setAlertTypeFetchGrade);
    } catch (error) {
      console.error('Error fetching student grade', error);
      displayMessage('Error fetching student grade', 'error', setAlertMessageFetchGrade, setAlertTypeFetchGrade);
    }
  };

  return (
    <div className="App">
      <h1>Student Information System</h1>
      <input placeholder="USN" className="input" name="number" type="number" onChange={(e) => setUsn(e.target.value)} />
      <input placeholder="Name" className="input" name="text" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Minor" className="input" name="text" type="text" onChange={(e) => setMinor(e.target.value)}/>
      <button onClick={addStudent} >Add Student</button>
      {alertMessageAddStudent && alertTypeAddStudent === 'success' && <div className="alert-success">{alertMessageAddStudent}</div>}
      {alertMessageAddStudent && alertTypeAddStudent === 'error' && <div className="alert-error">{alertMessageAddStudent}</div>}
      <div>
        <h2>Update Attendance</h2>
        <input type="number" className="input" placeholder="USN" value={usnToUpdateAttendance} onChange={(e) => setUsnToUpdateAttendance(e.target.value)} />
        <input type="text" className="input" placeholder="Course" value={courseToUpdateAttendance} onChange={(e) => setCourseToUpdateAttendance(e.target.value)} />
        <input type="text" className="input" placeholder="Attendance" value={attendanceToUpdate} onChange={(e) => setAttendanceToUpdate(e.target.value)} />
        <button onClick={updateAttendance}>Update Attendance</button>
        {alertMessageUpdateAttendance && alertTypeUpdateAttendance === 'success' && <div className="alert-success">{alertMessageUpdateAttendance}</div>}
        {alertMessageUpdateAttendance && alertTypeUpdateAttendance === 'error' && <div className="alert-error">{alertMessageUpdateAttendance}</div>}
      </div>
      <div>
        <h2>Update Grade</h2>
        <input type="number" className="input" placeholder="USN" value={usnToUpdateGrade} onChange={(e) => setUsnToUpdateGrade(e.target.value)} />
        <input type="text" className="input"placeholder="Course" value={courseToUpdateGrade} onChange={(e) => setCourseToUpdateGrade(e.target.value)} />
        <input type="number" className="input" placeholder="Grade" value={gradeToUpdate} onChange={(e) => setGradeToUpdate(e.target.value)} />
        <button onClick={updateGrade}>Update Grade</button>
        {alertMessageUpdateGrade && alertTypeUpdateGrade === 'success' && <div className="alert-success">{alertMessageUpdateGrade}</div>}
        {alertMessageUpdateGrade && alertTypeUpdateGrade === 'error' && <div className="alert-error">{alertMessageUpdateGrade}</div>}
      </div>
      <div>
        <h2>Fetch Student USNs</h2>
        <button onClick={fetchStudentUSNs}>Fetch Student USNs</button>
        {alertMessageFetchUSNs && alertTypeFetchUSNs === 'success' && <div className="alert-success">{alertMessageFetchUSNs}</div>}
        {alertMessageFetchUSNs && alertTypeFetchUSNs === 'error' && <div className="alert-error">{alertMessageFetchUSNs}</div>}
      </div>
      <div>
        <h2>Fetch Student Attendance</h2>
        <input type="number" className="input" placeholder="USN" value={usnToFetch} onChange={(e) => setUsnToFetch(e.target.value)} />
        <input type="text" className="input" placeholder="Course" value={courseToFetchAttendance} onChange={(e) => setCourseToFetchAttendance(e.target.value)} />
        <button onClick={fetchStudentAttendance}>Fetch Student Attendance</button>
        {alertMessageFetchAttendance && alertTypeFetchAttendance === 'success' && <div className="alert-success">{alertMessageFetchAttendance}</div>}
        {alertMessageFetchAttendance && alertTypeFetchAttendance === 'error' && <div className="alert-error">{alertMessageFetchAttendance}</div>}
      </div>
      <div>
        <h2>Fetch Student Grade</h2>
        <input type="number" className="input" placeholder="USN" value={usnToFetch} onChange={(e) => setUsnToFetch(e.target.value)} />
        <input type="text" className="input" placeholder="Course" value={courseToFetchGrade} onChange={(e) => setCourseToFetchGrade(e.target.value)} />
        <button onClick={fetchStudentGrade}>Fetch Student Grade</button>
        {alertMessageFetchGrade && alertTypeFetchGrade === 'success' && <div className="alert-success">{alertMessageFetchGrade}</div>}
        {alertMessageFetchGrade && alertTypeFetchGrade === 'error' && <div className="alert-error">{alertMessageFetchGrade}</div>}
      </div>
    </div>
  );
}

export default App;
