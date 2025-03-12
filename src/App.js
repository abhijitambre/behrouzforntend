import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Modal } from "react-bootstrap";
import { logo, bg1, strip, strip2, thank } from "./assets";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const OTPForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);
  const validateName = (value) => {
    const regex = /^[a-zA-Z\s]{0,50}$/;
    if (regex.test(value) || value === "") {
      setName(value.slice(0, 50));
    }
  };

  const validatePhone = (value) => {
    setPhone(value.replace(/\D/g, "").slice(0, 10));
  };

  const validateEmail = (value) => {
    setEmail(value);
  };

  const handleSendOtp = async () => {
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid phone number");
      return;
    }

    setIsSendingOtp(true);
    try {
      await axios.post(
        "https://abbie-c8b13266.serverless.boltic.app/send-otp",
        {
          name,
          phoneNumber: `+91${phone}`,
          email,
        }
      );
      setShowOtpField(true);
      if (resendTimer === 0) {
        setResendTimer(30);
      }
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
    if (!otp) {
      alert("Please enter a valid OTP");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await axios.post(
        "https://abbie-c8b13266.serverless.boltic.app/verify-otp",
        {
          phoneNumber: `+91${phone}`,
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
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsResendingOtp(true);
    try {
      await axios.post(
        "https://abbie-c8b13266.serverless.boltic.app/send-otp",
        {
          name,
          phoneNumber: `+91${phone}`,
          email,
        }
      );
      setResendTimer(30);
      alert("OTP resent successfully");
    } catch (error) {
      alert(
        "Error resending OTP: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setIsResendingOtp(false);
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
    setShowSuccessPopup(true);
  };

  return (
    <div className="position-relative">
      <div className="background-images">
        <img src={bg1} alt="bg1" className="w-100 mh-100 object-fit-fill" />
      </div>
      <div className="max-w-md mx-auto p-6 h-100 rounded-xl shadow-md position-absolute top-0 mh-100 w-100 d-flex flex-column justify-content-center align-items-center px-4">
        <img src={logo} alt="logo" className="w-60 h-auto object-contain" />
        <h2 className="text-center blinker-semibold color-gold heading mt-4 mb-3">
          Barkat-e-Behrouz
        </h2>
        <img
          src={strip}
          alt="strip"
          className="w-60 h-auto object-contain my-1"
        />
        <form onSubmit={handleSubmit} className="w-100 position-relative">
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => validateName(e.target.value)}
              className="w-100 px-3 py-2 input-text blinker-bold border rounded-lg bg-beige br-20 border-0"
              required
              placeholder="Name"
            />
          </div>
          <div className="mb-3 position-relative">
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
              className="position-absolute end-0 top-50 translate-middle-y btn2 me-2 bg-transparent blinker-bold btn-text border-0 text-black py-1 px-3"
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </div>
          {showOtpField && (
            <div className="mb-3 position-relative">
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
                className="position-absolute top-36 end-0 translate-middle-y btn2 me-2 bg-transparent blinker-bold btn-text border-0 text-black py-1 px-3"
                disabled={isVerifyingOtp} 
              >
                {isVerifyingOtp
                  ? "Verifying..."
                  : otpVerified
                  ? "OTP Verified"
                  : "Verify OTP"}
              </button>
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className="bg-transparent text-white border-0 btn2"
              >
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : "Resend OTP"}
              </button>
            </div>
          )}
          <ReCAPTCHA
            sitekey="6LfVZvEqAAAAAC4i_VT1fp_LI6-QtbRmFqjeZCok"
            onChange={setCaptchaToken}
          />
          <button
            type="submit"
            className="w-100 bg-gold blinker-semibold btn-text text-black py-2 br-20 border-0"
          >
            Click to donate a biryani
          </button>
        </form>
        <Modal
          show={showSuccessPopup}
          onHide={() => setShowSuccessPopup(false)}
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body className="bg-beige br-20 text-center">
            <div className="mt-neg60 text-center">
              <img
                src={thank}
                alt="thank You"
                className="w-80 h-auto object-contain my-1"
              />
            </div>
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
    </div>
  );
};

export default OTPForm;
