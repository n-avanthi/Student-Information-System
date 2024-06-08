const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("StudentInformationSystem", function () {
  let contract;
  let owner;
  let otherAccount;
  const fee = 1

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("StudentInformationSystem");
    contract = await Contract.deploy();
  });

  describe("Deployment", function () {
    it("Should set the owner correctly", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the admission fee correctly", async function () {
      expect(await contract.admissionFee()).to.equal(fee);
    });
  });

  describe("Student Addition", function () {
    it("Should add a student correctly", async function () {
      const usn = 1;
      const name = "John Doe";
      const minor = "Computer Science";
      const admissionFee = 1;

      await contract.addStudent(usn, name, minor, { value: admissionFee });

      const studentInfo = await contract.getStudentInfo(usn);
      expect(studentInfo.usn).to.equal(usn);
      expect(studentInfo.name).to.equal(name);
      expect(studentInfo.minor).to.equal(minor);
      expect(studentInfo.courses.length).to.equal(0);

      const studentUSNs = await contract.getStudentUSNs();
      expect(studentUSNs.length).to.equal(1);
      expect(studentUSNs[0]).to.equal(usn);
    });

    it("Should fail if admission fee is not paid", async function () {
      const usn = 1;
      const name = "John Doe";
      const minor = "Computer Science";

      await expect(contract.addStudent(usn, name, minor)).to.be.revertedWith("Insufficient admission fee.");
    });

    it("Should fail if USN is zero", async function () {
      const usn = 0;
      const name = "John Doe";
      const minor = "Computer Science";
      const admissionFee = 1;

      await expect(contract.addStudent(usn, name, minor, { value: admissionFee })).to.be.revertedWith("USN cannot be zero.");
    });

    it("Should fail if student with the same USN already exists", async function () {
      const usn = 1;
      const name = "John Doe";
      const minor = "Computer Science";
      const admissionFee = 1;

      await contract.addStudent(usn, name, minor, { value: admissionFee });

      await expect(contract.addStudent(usn, name, minor, { value: admissionFee })).to.be.revertedWith("Student with this USN already exists.");
    });
  });

  describe("Attendance and Grade Updates", function () {
    let usn;
    let name;
    let minor;
    let admissionFee;

    beforeEach(async function () {
      usn = 1;
      name = "John Doe";
      minor = "Computer Science";
      admissionFee = 1;
      await contract.addStudent(usn, name, minor, { value: admissionFee });
    });

    it("Should update attendance correctly", async function () {
      const course = "Math";
      const attendance = 80;

      await contract.updateAttendance(usn, course, attendance);

      const studentAttendance = await contract.getStudentAttendance(usn, course);
      expect(studentAttendance).to.equal(attendance);
    });

    it("Should fail to update attendance for non-existent student", async function () {
      const course = "Math";
      const attendance = 80;
      const nonExistentUsn = 2;

      await expect(contract.updateAttendance(nonExistentUsn, course, attendance)).to.be.revertedWith("Student with this USN does not exist.");
    });

    it("Should update grade correctly", async function () {
      const course = "Math";
      const grade = 8;

      await contract.updateGrade(usn, course, grade);

      const studentGrade = await contract.getStudentGrade(usn, course);
      expect(studentGrade).to.equal(grade);
    });

    it("Should fail to update grade for non-existent student", async function () {
      const course = "Math";
      const grade = 8;
      const nonExistentUsn = 2;

      await expect(contract.updateGrade(nonExistentUsn, course, grade)).to.be.revertedWith("Student with this USN does not exist.");
    });
  });
});