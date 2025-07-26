import React from 'react';
import { Formik, Form } from 'formik';
import useFormStore from '../../store/formStore';
import { createValidationSchema, getInitialValues } from '../../utils/validation';
import PreviewField from './PreviewField';
import { PencilIcon } from '@heroicons/react/24/outline';

const FormPreview = () => {
  const { 
    formTitle, 
    formDescription, 
    fields, 
    isPreviewMode, 
    togglePreviewMode,
    clearFormResponses,
    isFieldVisible
  } = useFormStore();

  if (!isPreviewMode) {
    return null;
  }

  const visibleFields = fields.filter(field => isFieldVisible(field));
  const validationSchema = createValidationSchema(visibleFields);
  const initialValues = getInitialValues(visibleFields);

  const handleSubmit = (values, { setSubmitting }) => {
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', values);
      alert('Form submitted successfully! Check the console for values.');
      setSubmitting(false);
    }, 1000);
  };

  const handleReset = () => {
    clearFormResponses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          {/* Center - Heading */}
          <div className="text-center">
            <button
              onClick={togglePreviewMode}
              className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-1"
            >
              <span className="text-blue-600">FormYu</span>
              <span className="text-gray-700 font-medium"> - Form Builder</span>
            </button>
            <p className="text-base text-gray-600">Preview mode - Test how your form looks and behaves</p>
          </div>
        </div>
      </div>

      {/* Form Content - Enhanced Centering */}
      <div className="py-12 flex justify-center">
        <div className="w-full max-w-3xl px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 fade-in">
            {/* Form Header - Centered */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{formTitle}</h1>
              {formDescription && (
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">{formDescription}</p>
              )}
            </div>

            {/* Form */}
            {visibleFields.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No fields to display</h3>
                <p className="text-gray-600">
                  Add some fields to your form to see the preview
                </p>
              </div>
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6 max-w-2xl mx-auto">
                    {visibleFields.map((field) => (
                      <PreviewField
                        key={field.id}
                        field={field}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    ))}

                    <div className="flex items-center justify-center pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Form'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Action Buttons - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex flex-col space-y-6">
          <button
            onClick={handleReset}
            className="flex items-center space-x-3 px-6 py-4 text-base font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all hover:scale-105 border border-gray-200 shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset Form</span>
          </button>

          <button
            onClick={togglePreviewMode}
            className="flex items-center space-x-3 px-6 py-4 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-xl"
          >
            <PencilIcon className="w-5 h-5" />
            <span>Edit Form</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
