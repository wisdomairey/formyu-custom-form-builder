import * as Yup from 'yup';
import type { FormField, ValidationRule, FieldValue } from '../types/form';

/**
 * Creates a Yup validation schema for a single form field
 */
export const createFieldValidationSchema = (field: FormField) => {
  let schema: Yup.AnySchema = Yup.mixed();

  // Base type validation
  switch (field.type) {
    case 'text':
    case 'textarea':
      schema = Yup.string();
      break;
    case 'email':
      schema = Yup.string().email('Please enter a valid email address');
      break;
    case 'number':
      schema = Yup.number().typeError('Please enter a valid number');
      break;
    case 'date':
      schema = Yup.date().typeError('Please enter a valid date');
      break;
    case 'select':
    case 'radio':
      schema = Yup.string();
      break;
    case 'checkbox':
      schema = Yup.array().of(Yup.string());
      break;
    case 'file':
      schema = Yup.mixed();
      break;
    default:
      schema = Yup.mixed();
  }

  // Apply custom validation rules
  field.validation.forEach(rule => {
    schema = applyValidationRule(schema, rule);
  });

  // Apply required validation
  if (field.required) {
    if (field.type === 'checkbox') {
      schema = (schema as Yup.ArraySchema<string[], Yup.AnyObject>).min(1, `${field.label} is required`);
    } else if (field.type === 'file') {
      schema = schema.test('required', `${field.label} is required`, (value) => {
        return value && (value as FileList).length > 0;
      });
    } else {
      schema = schema.required(`${field.label} is required`);
    }
  }

  return schema;
};

/**
 * Applies a specific validation rule to a Yup schema
 */
const applyValidationRule = (schema: Yup.AnySchema, rule: ValidationRule): Yup.AnySchema => {
  switch (rule.type) {
    case 'required':
      return schema.required(rule.message);
    
    case 'minLength':
      if (schema instanceof Yup.StringSchema) {
        return schema.min(Number(rule.value), rule.message);
      }
      break;
    
    case 'maxLength':
      if (schema instanceof Yup.StringSchema) {
        return schema.max(Number(rule.value), rule.message);
      }
      break;
    
    case 'email':
      if (schema instanceof Yup.StringSchema) {
        return schema.email(rule.message);
      }
      break;
    
    case 'pattern':
      if (schema instanceof Yup.StringSchema && rule.value) {
        return schema.matches(new RegExp(String(rule.value)), rule.message);
      }
      break;
    
    case 'min':
      if (schema instanceof Yup.NumberSchema) {
        return schema.min(Number(rule.value), rule.message);
      }
      break;
    
    case 'max':
      if (schema instanceof Yup.NumberSchema) {
        return schema.max(Number(rule.value), rule.message);
      }
      break;
  }
  
  return schema;
};

/**
 * Creates a complete Yup validation schema for the entire form
 */
export const createFormValidationSchema = (fields: FormField[]) => {
  const schemaFields: Record<string, Yup.AnySchema> = {};

  fields.forEach(field => {
    schemaFields[field.id] = createFieldValidationSchema(field);
  });

  return Yup.object().shape(schemaFields);
};

/**
 * Validates a single field value
 */
export const validateFieldValue = async (field: FormField, value: FieldValue): Promise<string | null> => {
  try {
    const schema = createFieldValidationSchema(field);
    await schema.validate(value);
    return null;
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return error.message;
    }
    return 'Validation error';
  }
};

/**
 * Validates all fields in the form
 */
export const validateFormData = async (fields: FormField[], formData: Record<string, FieldValue>) => {
  const errors: Record<string, string> = {};
  
  // Validate each field individually
  await Promise.all(
    fields.map(async (field) => {
      const value = formData[field.id];
      const error = await validateFieldValue(field, value);
      if (error) {
        errors[field.id] = error;
      }
    })
  );
  
  return errors;
};

/**
 * Creates validation rules based on field type
 */
export const getDefaultValidationRules = (fieldType: FormField['type']): ValidationRule[] => {
  switch (fieldType) {
    case 'email':
      return [
        { type: 'email', message: 'Please enter a valid email address' }
      ];
    case 'number':
      return [
        { type: 'min', value: 0, message: 'Value must be greater than or equal to 0' }
      ];
    case 'text':
    case 'textarea':
      return [
        { type: 'minLength', value: 1, message: 'This field cannot be empty' }
      ];
    default:
      return [];
  }
};

/**
 * Utility function to check if a value is empty based on field type
 */
export const isFieldValueEmpty = (value: FieldValue, fieldType: FormField['type']): boolean => {
  if (value === null || value === undefined) return true;
  
  switch (fieldType) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'select':
    case 'radio':
      return String(value).trim() === '';
    case 'number':
      return value === '' || isNaN(Number(value));
    case 'checkbox':
      return Array.isArray(value) && value.length === 0;
    case 'file':
      return !value || (value as FileList).length === 0;
    case 'date':
      return !value || String(value) === '';
    default:
      return !value;
  }
};

/**
 * Formats validation error messages for display
 */
export const formatValidationError = (field: FormField, error: string): string => {
  // Remove field name from error message if it's already included
  const fieldNamePattern = new RegExp(`^${field.label}\\s+`, 'i');
  if (fieldNamePattern.test(error)) {
    return error;
  }
  
  // Add field context to generic errors
  const genericErrors = ['is required', 'must be', 'should be'];
  const isGeneric = genericErrors.some(pattern => error.toLowerCase().includes(pattern));
  
  if (isGeneric && !error.toLowerCase().includes(field.label.toLowerCase())) {
    return `${field.label} ${error.toLowerCase()}`;
  }
  
  return error;
};

/**
 * Helper to determine if a field should show validation errors immediately
 */
export const shouldShowValidationError = (field: FormField, value: FieldValue, hasBeenTouched: boolean): boolean => {
  // Always show errors for required fields that are empty after being touched
  if (field.required && hasBeenTouched && isFieldValueEmpty(value, field.type)) {
    return true;
  }
  
  // Show errors for fields with content that fail validation
  if (!isFieldValueEmpty(value, field.type)) {
    return true;
  }
  
  return false;
};
