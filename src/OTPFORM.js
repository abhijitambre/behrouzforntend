const handleSendOtp = async () => {
  if (phone.length === 10) {
    const response = await fetch("http://localhost:5000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await response.json();
    if (data.success) {
      setShowOtpField(true);
      alert("OTP sent to " + phone);
    } else {
      alert("Failed to send OTP");
    }
  } else {
    alert("Please enter a valid 10-digit phone number");
  }
};

const handleVerifyOtp = async () => {
  if (otp.length > 0) {
    const response = await fetch("http://localhost:5000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await response.json();
    if (data.success) {
      setOtpVerified(true);
    } else {
      alert("Invalid OTP");
    }
  } else {
    alert("Please enter a valid OTP");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!otpVerified) {
    alert("Please verify OTP before submitting");
    return;
  }

  const response = await fetch("http://localhost:5000/submit-form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone }),
  });

  const data = await response.json();
  if (data.success) {
    setShowSuccessPopup(true);
  } else {
    alert("Error saving data");
  }
};
