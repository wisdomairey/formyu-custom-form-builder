import React from 'react';
import type { FormFieldComponentProps } from '../types/form';

const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  field,
  value,
  error,
  onChange,
  disabled = false,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValues = (value as string[]) || [];
    const newValue = event.target.value;
    
    if (event.target.checked) {
      onChange([...currentValues, newValue]);
    } else {
      onChange(currentValues.filter(v => v !== newValue));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files);
  };

  const renderField = () => {
    const baseClasses = "input-field";
    const errorClasses = error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
    const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses}`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.id}
            value={String(value || '')}
            placeholder={field.placeholder}
            onChange={handleInputChange}
            disabled={disabled}
            className={inputClasses}
            step={field.type === 'number' ? 'any' : undefined}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.id}
            value={String(value || '')}
            placeholder={field.placeholder}
            onChange={handleInputChange}
            disabled={disabled}
            className={`${inputClasses} min-h-[100px] resize-y`}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            name={field.id}
            value={String(value || '')}
            onChange={handleInputChange}
            disabled={disabled}
            className={inputClasses}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleInputChange}
                  disabled={disabled}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox': {
        const checkboxValues = (value as string[]) || [];
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={field.id}
                  value={option.value}
                  checked={checkboxValues.includes(option.value)}
                  onChange={handleCheckboxChange}
                  disabled={disabled}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );
      }

      case 'file':
        return (
          <input
            type="file"
            id={field.id}
            name={field.id}
            onChange={handleFileChange}
            disabled={disabled}
            className={`${inputClasses} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100`}
          />
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            name={field.id}
            value={String(value || '')}
            placeholder={field.placeholder}
            onChange={handleInputChange}
            disabled={disabled}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {field.description && (
        <p className="text-sm text-gray-500">{field.description}</p>
      )}
      
      {renderField()}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormFieldComponent;
