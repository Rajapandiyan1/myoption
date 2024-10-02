'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotEmail() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpid, setOtpId] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [countdown, setCountdown] = useState(15);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let timer:any;
    if (isCountingDown) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) return prev - 1;
          setIsCountingDown(false);
          setCanResendOtp(true);
          return 15;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCountingDown]);

  const handleSendOtp = () => {
    setEmailError('');
    setIsLoading(true);

    fetch(`https://server-1-nu7h.onrender.com/forgot`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) throw data;
        setOtpSent(true);
        setOtpId(data.registerId);
        setCanResendOtp(false);
        setIsCountingDown(true);
      })
      .catch(() => {
        setEmailError('Error sending OTP. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const handleVerifyOtp = () => {
    setOtpError('');
    setIsVerifyingOtp(true);

    fetch(`https://server-1-nu7h.onrender.com/forgot/otp/${otpid}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) throw data;
        setIsOtpVerified(true);
      })
      .catch(() => {
        setOtpError('Invalid OTP. Please try again.');
      })
      .finally(() => setIsVerifyingOtp(false));
  };

  const handleChangePassword = () => {
    setPasswordError('');
    setIsChangingPassword(true);

    fetch(`https://server-1-nu7h.onrender.com/forgot/setPassword/${otpid}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setPassword: confirmPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) throw data;
        router.push('/Login');
      })
      .catch(() => {
        setPasswordError('Error changing password. Please try again.');
      })
      .finally(() => setIsChangingPassword(false));
  };
// api 
  const handleResendOtp = () => {
    setOtpError('');
    setIsResendingOtp(true);
    setOtp(''); // Reset OTP field on resend
    fetch(`https://server-1-nu7h.onrender.com/forgot`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) throw data;
        setCanResendOtp(false);
        setIsCountingDown(true);
      })
      .catch(() => {
        setOtpError('Error resending OTP. Please try again.');
      })
      .finally(() => setIsResendingOtp(false));
  };

  const handleBack = () => {
    if (isOtpVerified) {
      setIsOtpVerified(false); // Reset OTP verification state to go back to OTP input
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } else {
      setOtpSent(false); // Reset OTP state to go back to email input
      setOtp('');
      setEmailError('');
      setOtpError('');
    }
  };

  // Limit OTP input to 4 digits and only allow numbers
  const handleOtpChange = (e:any) => {
    const { value } = e.target;
    if (/^\d{0,4}$/.test(value)) { // Allow only numbers and limit to 4 digits
      setOtp(value);
    }
  };

  return (
    <div style={{ minHeight: '90vh' }} className="flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {!isOtpVerified ? (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Forgot Email</h2>
            {!otpSent ? (
              <>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
                </div>
                <button
                  onClick={handleSendOtp}
                  className={`w-full text-white py-2 rounded-lg hover:bg-blue-600 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-gray-700">Enter OTP</label>
                  <input
                    id="otp"
                    type="text"
                    className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                    value={otp}
                    onChange={handleOtpChange} // Updated to use the new function
                    maxLength={4} // Ensures the input cannot exceed 4 characters
                  />
                  {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
                </div>
                <button
                  onClick={handleVerifyOtp}
                  className={`w-full text-white py-2 rounded-lg hover:bg-green-600 ${isVerifyingOtp ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500'}`}
                  disabled={isVerifyingOtp}
                >
                  {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  onClick={handleResendOtp}
                  className={`w-full mt-2 text-white py-2 rounded-lg hover:bg-yellow-600 ${!canResendOtp || isResendingOtp ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-500'}`}
                  disabled={!canResendOtp || isResendingOtp}
                >
                  {isResendingOtp ? 'Resending...' : canResendOtp ? 'Resend OTP' : `Resend in ${countdown}s`}
                </button>
                <button
                  onClick={handleBack}
                  className="w-full mt-4 text-gray-700 py-2 rounded-lg hover:bg-gray-200 bg-gray-100"
                >
                  Back
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Change Password</h2>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
              <input
                id="newPassword"
                type="password"
                className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
            </div>
            <button
              onClick={handleChangePassword}
              className={`w-full text-white py-2 rounded-lg hover:bg-blue-600 ${isChangingPassword ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'}`}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </button>
            <button
              onClick={handleBack}
              className="w-full mt-4 text-gray-700 py-2 rounded-lg hover:bg-gray-200 bg-gray-100"
            >
              Back to OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
