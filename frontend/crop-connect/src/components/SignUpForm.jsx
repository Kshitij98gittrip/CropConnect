import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import "../css/SignUpForm.css";
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [aadhaarNo, setAadhaarNo] = useState('');
  const [userType, setUserType] = useState('farmer');

  // Validation error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    mobileNumber: '',
    aadhaarNo: '',
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'email':
        setEmail(value);
        if (!value) {
          setEmailError('');
        } else if (!emailRegex.test(value)) {
          setEmailError('Email must start with a letter and be in a valid format. Example: user@example.com');
        } else {
          setEmailError('');
        }
        break;
      case 'password':
        setPassword(value);
        if (!value) {
          setPasswordError('');
        } else if (value.length < 6) {
          setPasswordError('Password must be at least 6 characters long');
        } else {
          setPasswordError('');
        }
        break;
      case 'firstName':
        setFirstName(value);
        setFieldErrors({
          ...fieldErrors,
          firstName: value ? (value.length < 3 ? 'First Name must be at least 3 characters' : '') : ''
        });
        break;
      case 'lastName':
        setLastName(value);
        setFieldErrors({
          ...fieldErrors,
          lastName: value ? (value.length < 3 ? 'Last Name must be at least 3 characters' : '') : ''
        });
        break;
      case 'addressLine1':
        setAddressLine1(value);
        setFieldErrors({
          ...fieldErrors,
          addressLine1: value ? (value.length < 6 ? 'Address Line 1 must be at least 6 characters' : '') : ''
        });
        break;
      case 'addressLine2':
        setAddressLine2(value);
        setFieldErrors({
          ...fieldErrors,
          addressLine2: value ? (value.length < 6 ? 'Address Line 2 must be at least 6 characters' : '') : ''
        });
        break;
      case 'city':
        setCity(value);
        setFieldErrors({
          ...fieldErrors,
          city: value ? (value.length < 3 ? 'City must be at least 3 characters' : '') : ''
        });
        break;
      case 'state':
        setState(value);
        setFieldErrors({
          ...fieldErrors,
          state: value ? (value.length < 3 ? 'State must be at least 3 characters' : '') : ''
        });
        break;
      case 'country':
        setCountry(value);
        setFieldErrors({
          ...fieldErrors,
          country: value ? (value.length < 3 ? 'Country must be at least 3 characters' : '') : ''
        });
        break;
      case 'postalCode':
        setPostalCode(value);
        setFieldErrors({
          ...fieldErrors,
          postalCode: value ? (value.length < 5 ? 'Postal Code must be at least 5 characters' : '') : ''
        });
        break;
      case 'mobileNumber':
        setMobileNumber(value);
        setFieldErrors({
          ...fieldErrors,
          mobileNumber: value ? (value.length < 10 || isNaN(value) ? 'Mobile Number must be at least 10 digits and must be a number' : '') : ''
        });
        break;
      case 'aadhaarNo':
        setAadhaarNo(value);
        setFieldErrors({
          ...fieldErrors,
          aadhaarNo: value ? ((value.length < 12 || value.length > 12) || isNaN(value) ? 'Aadhaar Number must be 12 digits and must be a number' : '') : ''
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error and success messages
    setFormError('');
    setSuccessMessage('');

    const hasErrors = Object.values(fieldErrors).some(error => error) || emailError || passwordError;

    if (
      email && password && firstName && lastName &&
      addressLine1 && city && state && country && postalCode && mobileNumber &&
      aadhaarNo &&
      !hasErrors
    ) {
      const data = {
        firstName,
        lastName,
        aadhaarNo,
        addressDTO: {
          addressLine1,
          addressLine2,
          city,
          state,
          country,
          postalCode,
          mobileNumber,
        },
        userDTO: {
          email,
          password,
          role: userType.toUpperCase(),
        },
      };

      try {
        await signUp(data);
        setSuccessMessage('Sign-up successful! Redirecting to sign-in page.');
        setTimeout(() => navigate('/signin'), 2000); // Delay redirection to show success message
      } catch (error) {
        setFormError(`Sign-up failed: ${error.message || 'An error occurred. Please try again.'}`);
      }
    } else {
      setFormError('Please fill in all required fields and correct any errors.');
    }
  };

  return (
    <div className="signup-container">
      <div className="row justify-content-center align-items-center">
        <div className="col-10 col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4">Registration Form</h3>
              <form onSubmit={handleSubmit}>
                {/* User Type Radio Buttons */}
                <div className="row mb-3">
                  <div className="mb-4">
                    <label className="form-label">
                      User Type <span className="text-danger">*</span>
                    </label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="userType"
                          id="farmer"
                          value="farmer"
                          checked={userType === 'farmer'}
                          onChange={(e) => setUserType(e.target.value)}
                          required
                        />
                        <label className="form-check-label" htmlFor="farmer">
                          Farmer
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="userType"
                          id="merchant"
                          value="merchant"
                          checked={userType === 'merchant'}
                          onChange={(e) => setUserType(e.target.value)}
                          required
                        />
                        <label className="form-check-label" htmlFor="merchant">
                          Merchant
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-control"
                      value={firstName}
                      onChange={handleInputChange}
                      required
                    />
                    {fieldErrors.firstName && <div className="text-danger">{fieldErrors.firstName}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-control"
                      value={lastName}
                      onChange={handleInputChange}
                      required
                    />
                    {fieldErrors.lastName && <div className="text-danger">{fieldErrors.lastName}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={email}
                      onChange={handleInputChange}
                      required
                    />
                    {emailError && <div className="text-danger">{emailError}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      value={password}
                      onChange={handleInputChange}
                      required
                    />
                    {passwordError && <div className="text-danger">{passwordError}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="addressLine1" className="form-label">
                      Address Line 1 <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      className="form-control"
                      value={addressLine1}
                      onChange={handleInputChange}
                      required
                    />
                    {fieldErrors.addressLine1 && <div className="text-danger">{fieldErrors.addressLine1}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="addressLine2" className="form-label">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      className="form-control"
                      value={addressLine2}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.addressLine2 && <div className="text-danger">{fieldErrors.addressLine2}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-control"
                      value={city}
                      onChange={handleInputChange}
                      required
                    />
                    {fieldErrors.city && <div className="text-danger">{fieldErrors.city}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">
                      State <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="form-control"
                      value={state}
                      onChange={handleInputChange}
                      required
                    />
                    {fieldErrors.state && <div className="text-danger">{fieldErrors.state}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="country" className="form-label">
                      Country <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      className="form-control"
                      value={country}
                      onChange={handleInputChange}
                      required
                    />
                    {fieldErrors.country && <div className="text-danger">{fieldErrors.country}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="postalCode" className="form-label">
                      Postal Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      className="form-control"
                      value={postalCode}
                      onChange={handleInputChange}
                      required
                    />
                    {fieldErrors.postalCode && <div className="text-danger">{fieldErrors.postalCode}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="mobileNumber" className="form-label">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="mobileNumber"
                      name="mobileNumber"
                      className="form-control"
                      value={mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                    {fieldErrors.mobileNumber && <div className="text-danger">{fieldErrors.mobileNumber}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="aadhaarNo" className="form-label">
                      Aadhaar Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="aadhaarNo"
                      name="aadhaarNo"
                      className="form-control"
                      value={aadhaarNo}
                      onChange={handleInputChange}
                      required
                    />
                    {fieldErrors.aadhaarNo && <div className="text-danger">{fieldErrors.aadhaarNo}</div>}
                  </div>
                </div>
  {/* Validation Error Messages */}
  {formError && <div className="text-danger">{formError}</div>}
                {successMessage && <div className="text-success">{successMessage}</div>}
                <button type="submit" className="btn btn-primary">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;