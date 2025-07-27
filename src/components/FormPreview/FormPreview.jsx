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
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-6 shadow-sm">
        <div className="flex items-center justify-between max-w-8xl mx-auto">
          {/* Center - Heading */}
          <div className="text-center flex-1 md:flex-none">
            <button
              onClick={togglePreviewMode}
              className="text-xl md:text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-1"
            >
              <span className="text-blue-600">FormYu</span>
              <span className="text-gray-700 font-medium"> - Form Builder</span>
            </button>
            <p className="text-sm md:text-base text-gray-600">Preview mode - Test how your form looks and behaves</p>
          </div>

          {/* Header Edit Button */}
          <div className="hidden md:block">
            <button
              onClick={togglePreviewMode}
              className="px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium"
            >
              <div className="flex items-center space-x-2">
                <PencilIcon className="w-5 h-5" />
                <span>Edit Form</span>
              </div>
            </button>
          </div>

          {/* Mobile Edit Button */}
          <div className="md:hidden">
            <button
              onClick={togglePreviewMode}
              className="px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium text-sm"
            >
              <div className="flex items-center space-x-2">
                <PencilIcon className="w-5 h-5" />
                <span>Edit</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Separator */}
      <div className="bg-gradient-to-r from-blue-100 via-purple-50 to-blue-100 h-2 shadow-inner"></div>

      {/* Form Content - Enhanced Centering with max width */}
      <div className="py-8 md:py-16 flex justify-center px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 fade-in relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 pointer-events-none"></div>
            <div className="relative z-10">
            {/* Form Header - Centered */}
            <div className="mb-6 md:mb-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{formTitle}</h1>
              {formDescription && (
                <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">{formDescription}</p>
              )}
            </div>

            {/* Form */}
            {visibleFields.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="text-4xl md:text-6xl mb-4">📝</div>
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
                  <Form className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
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
                        className="w-full sm:w-auto px-6 md:px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      </div>
      
      {/* Floating Action Buttons - Desktop */}
      <div className="fixed bottom-6 md:bottom-8 right-4 md:right-8 z-50 hidden md:block">
        <div className="flex flex-col space-y-4 md:space-y-6">
          <button
            onClick={handleReset}
            className="flex items-center space-x-3 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all hover:scale-105 border border-gray-200 shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset Form</span>
          </button>

          <button
            onClick={togglePreviewMode}
            className="flex items-center space-x-3 px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-110 shadow-2xl border-2 border-white/20 hover:shadow-blue-500/25"
          >
            <PencilIcon className="w-6 h-6" />
            <span>Edit Form</span>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex justify-center space-x-4 max-w-sm mx-auto">
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset</span>
          </button>

          <button
            onClick={togglePreviewMode}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <PencilIcon className="w-5 h-5" />
            <span>Edit Form</span>
          </button>
        </div>
      </div>

      {/* Mobile bottom spacing to account for fixed bottom bar */}
      <div className="md:hidden h-20" />
    </div>
  );
};

export default FormPreview;
