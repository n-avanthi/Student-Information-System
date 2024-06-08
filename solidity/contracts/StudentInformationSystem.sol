//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentInformationSystem {
    address public owner;
    uint256 public admissionFee;

    constructor() {
        owner = msg.sender;
        admissionFee = 1;
    }

    struct Student {
        uint256 usn;
        string name;
        string minor;
        string[] courses;
    }

    // Mapping to store students by their USN
    mapping(uint256 => Student) public students;

    // Nested mapping to store attendance for each student and course
    mapping(uint256 => mapping(string => uint256)) public studentAttendance;

    // Nested mapping to store grades for each student and course
    mapping(uint256 => mapping(string => uint256)) public studentGrades;

    uint256[] public studentUSNs;    

    event StudentAdded(uint256 indexed usn, string name);

    event AttendanceUpdated(uint256 indexed usn, string course, uint256 attendance);

    event GradeUpdated(uint256 indexed usn, string course, uint256 grade);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation.");
        _;
    }

    function addStudent(uint256 _usn, string memory _name, string memory _minor) public payable{
        require(msg.value >= admissionFee, "Insufficient admission fee.");
        require(_usn != 0, "USN cannot be zero.");
        require(students[_usn].usn == 0, "Student with this USN already exists.");

        payable(owner).transfer(msg.value);
        students[_usn] = Student(_usn, _name, _minor, new string[](0));
        studentUSNs.push(_usn);
        
        emit StudentAdded(_usn, _name);
    }

    function updateAttendance(uint256 _usn, string memory _course, uint256 _attendance) public onlyOwner {
        require(students[_usn].usn != 0, "Student with this USN does not exist.");
        require(_attendance <= 100, "Attendance cannot exceed 100.");
        require(_attendance > 0, "Attendance cannot be negative.");
        studentAttendance[_usn][_course] = _attendance;
        emit AttendanceUpdated(_usn, _course, _attendance);
    }

    function updateGrade(uint256 _usn, string memory _course, uint256 _grade) public onlyOwner {
        require(students[_usn].usn != 0, "Student with this USN does not exist.");
        require(_grade <= 10, "Grade cannot exceed 10.");
        require(_grade > 0, "Grade cannot be negative.");
        studentGrades[_usn][_course] = _grade;
        emit GradeUpdated(_usn, _course, _grade);
    }

    function getStudentUSNs() public view returns (uint256[] memory) {
        return studentUSNs;
    }

    function getStudentAttendance(uint256 _usn, string memory _course) public view returns (uint256) {
        require(students[_usn].usn != 0, "Student with this USN does not exist.");
        return studentAttendance[_usn][_course];
    }

    function getStudentGrade(uint256 _usn, string memory _course) public view returns (uint256) {
        require(students[_usn].usn != 0, "Student with this USN does not exist.");
        return studentGrades[_usn][_course];
    }
}