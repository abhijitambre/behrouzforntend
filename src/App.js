import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Modal } from "react-bootstrap";
import { logo, bg1, strip, strip2, thank } from "./assets";
import { saveDataToJson } from "./storage";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const OTPForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const validateName = (value) => {
    const regex = /^[a-zA-Z\s]{0,50}$/;
    if (regex.test(value) || value === "") {
      setName(value.slice(0, 50)); // Limit to 50 characters
    }
  };

  const validatePhone = (value) => {
    const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    setPhone(numericValue.slice(0, 10)); // Limit to 10 digits
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSendingOtp(true);
    try {
      await axios.post(
        "https://abbie-c8b13266.serverless.boltic.app/send-otp",
        {
          name,
          phoneNumber: phone,
        }
      );
      setShowOtpField(true);
      alert("OTP sent successfully");
    } catch (error) {
      alert(
        "Error sending OTP: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 0) {
      alert("Please enter a valid OTP");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await axios.post(
        "https://abbie-c8b13266.serverless.boltic.app/verify-otp",
        {
          phoneNumber: phone,
          otp,
        }
      );
      setOtpVerified(true);
      alert("OTP verified successfully");
    } catch (error) {
      alert(
        "Error verifying OTP: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify OTP before submitting");
      return;
    }
    if (!captchaToken) {
      alert("Please complete the reCAPTCHA verification");
      return;
    }

    saveDataToJson({ name, phone });
    setShowSuccessPopup(true);
  };

  return (
    <div className="position-relative">
      <div className="background-images">
        <div className="position-relative w-100">
          <img src={bg1} alt="bg1" className="w-100 mh-100 object-fit-fill" />
        </div>
      </div>
      <div className="max-w-md mx-auto p-6 h-100 rounded-xl shadow-md position-absolute top-0 mh-100 w-100 d-flex justify-content-start pt-120 align-items-center flex-column px-4">
        <img src={logo} alt="logo" className="w-60 h-auto object-contain" />
        <h2 className="text-center blinker-semibold color-gold heading mt-4 mb-3">
          Barkat-e-Behrouz
        </h2>
        <img
          src={strip}
          alt="strip"
          className="w-60 h-auto object-contain my-1"
        />
        <h1 className="blinker-semibold color-beige heading2 text-center">
          Welcome, Huzoor
        </h1>
        <p className="color-beige text-center blinker-regular text">
          This Ramadan, your Behrouz dawat is more than just a feast - it’s a
          chance to make someone’s Iftar special. If you wish to spread the
          barkat, share your contact details, and we will donate a biryani on
          your behalf at no cost to you.
        </p>
        <form onSubmit={handleSubmit} className="w-100 position-relative">
          <div className="mb-4 position-relative">
            <input
              type="text"
              value={name}
              onChange={(e) => validateName(e.target.value)}
              className="w-100 px-3 py-2 input-text blinker-bold border rounded-lg bg-beige br-20 border-0"
              required
              placeholder="Name"
              maxLength="50"
            />
          </div>

          <div className="mb-4 position-relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => validatePhone(e.target.value)}
              className="w-100 px-3 py-2 input-text blinker-bold border rounded-lg bg-beige br-20 border-0"
              required
              placeholder="Phone Number"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              className="position-absolute end-0 top-50 btn2 translate-middle-y me-2 bg-transparent blinker-bold btn-text border-0 text-black py-1 px-3"
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </div>

          {showOtpField && (
            <div className="mb-4 position-relative">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-100 px-3 py-2 input-text blinker-bold border rounded-lg bg-beige br-20"
                required
                placeholder="OTP"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="position-absolute end-0 top-50 translate-middle-y btn2 me-2 bg-transparent blinker-bold btn-text border-0 text-black py-1 px-3"
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp
                  ? "Verifying..."
                  : otpVerified
                  ? "OTP Verified"
                  : "Verify OTP"}
              </button>
            </div>
          )}

          <div className="mb-4 d-flex justify-content-center">
            <ReCAPTCHA
              sitekey="6Ld5WPEqAAAAAEu_Zkx52SAzu11vqd76KORrNFPk"
              onChange={(token) => setCaptchaToken(token)} // ✅ Correct usage
            />
          </div>

          <button
            type="submit"
            className="w-100 bg-gold blinker-semibold btn-text text-black py-2 br-20 border-0"
          >
            Click to donate a biryani
          </button>
        </form>
      </div>

      <Modal
        show={showSuccessPopup}
        onHide={() => setShowSuccessPopup(false)}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="bg-beige br-20 text-center">
          <img
            src={thank}
            alt="Thank You"
            className="w-80 h-auto object-contain my-1"
          />
          <h1 className="heading3 blinker-bold color-brown">
            Shukran, huzoor!
          </h1>
          <img
            src={strip2}
            alt="strip"
            className="w-60 h-auto object-contain my-1 mt-3"
          />
          <p className="text blinker-bold mt-3">
            If you wish to extend your support to those in need, you can
            directly contribute your donations to our partnered NGOs.
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OTPForm;
