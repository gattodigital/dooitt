// Validation utilities for authentication

// Email validation using regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation - OWASP recommendations
function validatePassword(password) {
  const errors = [];

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters.');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number.');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate sign-up data
function validateSignUpData(data) {
  const errors = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required.');
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format.');
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.push(...passwordValidation.errors);
  }

  if (data.firstName && typeof data.firstName !== 'string') {
    errors.push('First name must be a string.');
  }

  if (data.lastName && typeof data.lastName !== 'string') {
    errors.push('Last name must be a string.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate sign-in data
function validateSignInData(data) {
  const errors = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required.');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  isValidEmail,
  validatePassword,
  validateSignUpData,
  validateSignInData
};
