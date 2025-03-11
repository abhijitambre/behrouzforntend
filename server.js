require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const fs = require("fs");
const ExcelJS = require("exceljs");

const app = express();
app.use(express.json());
app.use(cors());

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const otpStore = {};

// Send OTP
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[phone] = otp;

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: "+Your_Twilio_Number",
      to: phone,
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (otpStore[phone] == otp) {
    delete otpStore[phone];
    res.json({ success: true, message: "OTP Verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// Save form data to Excel
app.post("/submit-form", async (req, res) => {
  const { name, phone } = req.body;

  const filePath = "donations.xlsx";
  const workbook = new ExcelJS.Workbook();

  try {
    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
    } else {
      workbook.addWorksheet("Donations");
    }

    const worksheet = workbook.getWorksheet("Donations");
    if (!worksheet.getRow(1).values.length) {
      worksheet.addRow(["Name", "Phone"]);
    }

    worksheet.addRow([name, phone]);
    await workbook.xlsx.writeFile(filePath);

    res.json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
