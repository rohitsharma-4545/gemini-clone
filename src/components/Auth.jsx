import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  setCountry,
  setPhone,
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
} from '../slices/authSlice';

const phoneSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
});
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// Replace country fetch with a hardcoded list
const COMMON_COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'Russia', code: '+7', flag: '🇷🇺' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
];

const Auth = () => {
  const dispatch = useDispatch();
  const { country, phone, otpSent, loading, error } = useSelector((state) => state.auth);
  // Remove countries state and useEffect
  // const [countries, setCountries] = useState([]);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSentState, setOtpSentState] = useState(false);

  // Phone form
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
    setValue: setPhoneValue,
  } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { country: country || '', phone: phone || '' },
  });

  // OTP form
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  // Handle phone form submit
  const onPhoneSubmit = (data) => {
    dispatch(setCountry(data.country));
    dispatch(setPhone(data.phone));
    dispatch(sendOtpStart());
    setOtpError('');
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      dispatch(sendOtpSuccess());
      setOtpSentState(true);
      // Show toast here if needed
    }, 1200);
  };

  // Handle OTP form submit
  const onOtpSubmit = (data) => {
    dispatch(verifyOtpStart());
    setOtpError('');
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      if (data.otp === '123456') {
        dispatch(verifyOtpSuccess({ id: Date.now(), phone, country }));
        // Show toast here if needed
      } else {
        dispatch(verifyOtpFailure('Invalid OTP'));
        setOtpError('Invalid OTP');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 w-full">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Sign In / Sign Up</h2>
        {!otpSent && !otpSentState ? (
          <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="space-y-4 w-full">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Country</label>
              <select
                {...registerPhone('country')}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white"
                defaultValue={country || ''}
                onChange={(e) => setPhoneValue('country', e.target.value)}
              >
                <option value="">Select country</option>
                {COMMON_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {phoneErrors.country && <p className="text-red-500 text-sm mt-1">{phoneErrors.country.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Phone Number</label>
              <div className="flex">
                <input
                  type="number"
                  {...registerPhone('phone')}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>
              {phoneErrors.phone && <p className="text-red-500 text-sm mt-1">{phoneErrors.phone.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
              disabled={loading || otpLoading}
            >
              {otpLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4 w-full">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Enter OTP</label>
              <input
                type="text"
                maxLength={6}
                {...registerOtp('otp')}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white tracking-widest text-center text-lg"
                placeholder="123456"
              />
              {otpErrors.otp && <p className="text-red-500 text-sm mt-1">{otpErrors.otp.message}</p>}
              {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
              disabled={loading || otpLoading}
            >
              {otpLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              className="w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded transition"
              onClick={() => {
                setOtpSentState(false);
                setOtpError('');
              }}
              disabled={loading || otpLoading}
            >
              Back
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth; 