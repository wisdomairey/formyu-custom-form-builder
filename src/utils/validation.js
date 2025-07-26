import * as Yup from 'yup';

export const createValidationSchema = (fields) => {
  const schemaFields = {};
  
  fields.forEach(field => {
    let validator;
    
    switch (field.type) {
      case 'email':
        validator = Yup.string().email('Invalid email format');
        break;
      case 'number':
        validator = Yup.number().typeError('Must be a number');
        break;
      case 'phone':
        validator = Yup.string().matches(
          /^[+]?[1-9][\d]{0,15}$/,
          'Invalid phone number format'
        );
        break;
      case 'url':
        validator = Yup.string().url('Invalid URL format');
        break;
      case 'date':
        validator = Yup.date().typeError('Invalid date format');
        break;
      default:
        validator = Yup.string();
    }
    
    // Add required validation
    if (field.required) {
      validator = validator.required(`${field.label} is required`);
    }
    
    // Add length validations
    if (field.validation.minLength) {
      validator = validator.min(
        field.validation.minLength, 
        `Must be at least ${field.validation.minLength} characters`
      );
    }
    
    if (field.validation.maxLength) {
      validator = validator.max(
        field.validation.maxLength, 
        `Must be no more than ${field.validation.maxLength} characters`
      );
    }
    
    // Add pattern validation
    if (field.validation.pattern) {
      try {
        const regex = new RegExp(field.validation.pattern);
        validator = validator.matches(regex, 'Invalid format');
      } catch {
        console.warn('Invalid regex pattern for field:', field.id);
      }
    }
    
    schemaFields[field.id] = validator;
  });
  
  return Yup.object().shape(schemaFields);
};

export const getInitialValues = (fields) => {
  const initialValues = {};
  
  fields.forEach(field => {
    switch (field.type) {
      case 'checkbox':
        initialValues[field.id] = [];
        break;
      case 'number':
        initialValues[field.id] = '';
        break;
      default:
        initialValues[field.id] = '';
    }
  });
  
  return initialValues;
};
