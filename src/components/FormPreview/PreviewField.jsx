import React, { useEffect } from 'react';
import { Field, ErrorMessage } from 'formik';
import useFormStore from '../../store/formStore';

const PreviewField = ({ field, values }) => {
  const { updateFormResponse, isFieldVisible } = useFormStore();

  // Update form responses for conditional logic
  useEffect(() => {
    updateFormResponse(field.id, values[field.id]);
  }, [field.id, values, updateFormResponse]);

  if (!isFieldVisible(field)) {
    return null;
  }

  const renderField = () => {
    const baseProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      className: "w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'phone':
      case 'url':
        return (
          <Field
            {...baseProps}
            type={field.type === 'phone' ? 'tel' : field.type}
          />
        );

      case 'number':
        return (
          <Field
            {...baseProps}
            type="number"
          />
        );

      case 'date':
        return (
          <Field
            {...baseProps}
            type="date"
          />
        );

      case 'textarea':
        return (
          <Field
            as="textarea"
            {...baseProps}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        );

      case 'select':
        return (
          <Field
            as="select"
            {...baseProps}
          >
            <option value="">Choose an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Field>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <Field
                  type="radio"
                  name={field.id}
                  value={option}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <Field
                  type="checkbox"
                  name={field.id}
                  value={option}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <Field name={field.id}>
            {({ form }) => (
              <input
                {...baseProps}
                type="file"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  form.setFieldValue(field.id, file);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            )}
          </Field>
        );

      default:
        return (
          <Field
            {...baseProps}
            type="text"
          />
        );
    }
  };

  return (
    <div
      className="space-y-2 fade-in"
    >
      <label htmlFor={field.id} className="block text-sm md:text-base font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderField()}
      
      <ErrorMessage
        name={field.id}
        component="div"
        className="text-red-600 text-xs md:text-sm"
      />
    </div>
  );
};

export default PreviewField;
