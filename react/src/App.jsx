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
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentAttendance, setStudentAttendance] = useState(null);
  const [studentGrade, setStudentGrade] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      // Connect to Metamask (or any other Web3 provider)
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Get the list of accounts
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          // Load the deployed contract
          const networkId = await web3Instance.eth.net.getId();
          const contractAddress = '0x6bFF6aFf8347Ec046458273ED10E2b098022DFaE'; // Replace with your deployed contract address
          const contractInstance = new web3Instance.eth.Contract(
            StudentInformationSystemABI.abi,
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error('Error connecting to blockchain', error);
        }
      } else {
        console.error('Please install MetaMask!');
      }
    };

    loadBlockchainData();
  }, []);

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
    // Print success message
    alert('Student added successfully!');
  } catch (error) {
    console.error('Error adding student', error);
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
      // Print success message
      alert('Attendance updated successfully!');
    } catch (error) {
      console.error('Error updating attendance', error);
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
      // Print success message
      alert('Grade updated successfully!');
    } catch (error) {
      console.error('Error updating grade', error);
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
      // Print success message
      const usnsString = usns.join(', ');
      alert('Student USNs: ' + usnsString);
    } catch (error) {
      console.error('Error fetching student USNs', error);
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
      // Print success message
      alert('Student Attendance: ' + attendance);
    } catch (error) {
      console.error('Error fetching student attendance', error);
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
      // Print success message
      alert('Student Grade: ' + grade);
    } catch (error) {
      console.error('Error fetching student grade', error);
    }
  };

  
  const fetchStudentInfo = async () => {
  if (contract && usnToFetch > 0) {
    try {
      const student = await contract.methods.getStudentInfo(usnToFetch).call();
      console.log("Student Info:", student);
      
      if (student.usn === 0) {
        setStudentInfo(["Invalid"]);
      } else {
        // Assuming the structure of student is {usn: <value>, name: <value>, minor: <value>, courses: <value>}
        setStudentInfo([student]);
        const studentString = student.join(', ');
        alert('Student USNs: ' + studentString);
      }
    } catch (error) {
      console.error("Error fetching student info:", error);
    }
  }
};

  return (
    <div className="App">
      <h1>Student Information System</h1>
      <input placeholder="USN" className="input" name="number" type="number" onChange={(e) => setUsn(e.target.value)} />
      <input placeholder="Name" className="input" name="text" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Minor" className="input" name="text" type="text" onChange={(e) => setMinor(e.target.value)}/>
      <button onClick={addStudent} >Add Student</button>
      
      <div>
        <h2>Update Attendance</h2>
        <input type="number" className="input" placeholder="USN" value={usnToUpdateAttendance} onChange={(e) => setUsnToUpdateAttendance(e.target.value)} />
        <input type="text" className="input" placeholder="Course" value={courseToUpdateAttendance} onChange={(e) => setCourseToUpdateAttendance(e.target.value)} />
        <input type="text" className="input" placeholder="Attendance" value={attendanceToUpdate} onChange={(e) => setAttendanceToUpdate(e.target.value)} />
        <button onClick={updateAttendance}>Update Attendance</button>
      </div>
      <div>
        <h2>Update Grade</h2>
        <input type="number" className="input" placeholder="USN" value={usnToUpdateGrade} onChange={(e) => setUsnToUpdateGrade(e.target.value)} />
        <input type="text" className="input"placeholder="Course" value={courseToUpdateGrade} onChange={(e) => setCourseToUpdateGrade(e.target.value)} />
        <input type="number" className="input" placeholder="Grade" value={gradeToUpdate} onChange={(e) => setGradeToUpdate(e.target.value)} />
        <button onClick={updateGrade}>Update Grade</button>
      </div>
      <div>
        <h2>Fetch Student USNs</h2>
        <button onClick={fetchStudentUSNs}>Fetch Student USNs</button>
      </div>
      <div>
        <h2>Fetch Student Attendance</h2>
        <input type="number" className="input" placeholder="USN" value={usnToFetch} onChange={(e) => setUsnToFetch(e.target.value)} />
        <input type="text" className="input" placeholder="Course" value={courseToFetchAttendance} onChange={(e) => setCourseToFetchAttendance(e.target.value)} />
        <button onClick={fetchStudentAttendance}>Fetch Student Attendance</button>
      </div>
      <div>
        <h2>Fetch Student Grade</h2>
        <input type="number" className="input" placeholder="USN" value={usnToFetch} onChange={(e) => setUsnToFetch(e.target.value)} />
        <input type="text" className="input" placeholder="Course" value={courseToFetchGrade} onChange={(e) => setCourseToFetchGrade(e.target.value)} />
        <button onClick={fetchStudentGrade}>Fetch Student Grade</button>
      </div>
      {/* Display alert message */}
      {alertMessage && (
        <div className={`alert-${alertType}`}>
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default App;
