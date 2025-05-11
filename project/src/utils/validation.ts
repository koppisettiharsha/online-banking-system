export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it's a valid number
  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }
  
  // Check length (most cards are 13-19 digits)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Luhn algorithm for card number validation
  let sum = 0;
  let isEven = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateCardDetails = (details: {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}): CardValidationResult => {
  const errors: string[] = [];
  
  // Validate card number
  if (!validateCardNumber(details.cardNumber)) {
    errors.push('Invalid card number');
  }
  
  // Validate expiry date (MM/YY format)
  if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(details.expiryDate)) {
    errors.push('Invalid expiry date (use MM/YY format)');
  } else {
    const [month, year] = details.expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      errors.push('Card has expired');
    }
  }
  
  // Validate CVV (3-4 digits)
  if (!/^[0-9]{3,4}$/.test(details.cvv)) {
    errors.push('Invalid CVV (must be 3-4 digits)');
  }
  
  // Validate cardholder name
  if (!details.cardholderName.trim()) {
    errors.push('Cardholder name is required');
  } else if (details.cardholderName.length < 3) {
    errors.push('Cardholder name is too short');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 