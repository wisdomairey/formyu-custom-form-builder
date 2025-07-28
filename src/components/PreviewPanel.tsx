import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Eye, Code, Download, FileText, ArrowLeft } from 'lucide-react';
import FormFieldComponent from './FormFieldComponent';
import { createFormValidationSchema, validateFormData } from '../utils/validationUtils';
import type { PreviewPanelProps } from '../types/form';

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  fields,
  formData,
  errors,
  onDataChange,
  onBack,
}) => {
  const [previewMode, setPreviewMode] = useState<'preview' | 'code'>('preview');
  const [submissionResult, setSubmissionResult] = useState<string>('');

  // Create Formik instance for form handling
  const formik = useFormik({
    initialValues: formData,
    validationSchema: createFormValidationSchema(fields),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        // Validate all fields
        const validationErrors = await validateFormData(fields, values);
        
        if (Object.keys(validationErrors).length === 0) {
          setSubmissionResult('Form submitted successfully! ✅');
          console.log('Form submission data:', values);
        } else {
          setSubmissionResult('Please fix the errors below before submitting.');
        }
      } catch (error) {
        setSubmissionResult('An error occurred while submitting the form.');
        console.error('Form submission error:', error);
      }
    },
  });

  // Generate form code for export
  const generateFormCode = () => {
    const fieldComponents = fields.map(field => {
      const validation = field.validation.map(rule => {
        switch (rule.type) {
          case 'required':
            return `.required('${rule.message}')`;
          case 'email':
            return `.email('${rule.message}')`;
          case 'minLength':
            return `.min(${rule.value}, '${rule.message}')`;
          case 'maxLength':
            return `.max(${rule.value}, '${rule.message}')`;
          default:
            return '';
        }
      }).join('');

      const yupType = field.type === 'number' ? 'number()' : 
                     field.type === 'email' ? 'string().email()' :
                     field.type === 'checkbox' ? 'array()' : 'string()';

      return `    ${field.id}: Yup.${yupType}${validation},`;
    }).join('\n');

    const formFields = fields.map(field => `        <FormField
          field={${JSON.stringify(field, null, 10)}}
          value={values.${field.id}}
          error={errors.${field.id}}
          onChange={(value) => setFieldValue('${field.id}', value)}
        />`).join('\n');

    return `import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from './FormField';

const GeneratedForm = () => {
  const formik = useFormik({
    initialValues: {
${fields.map(field => `      ${field.id}: ${JSON.stringify(field.defaultValue || '')},`).join('\n')}
    },
    validationSchema: Yup.object({
${fieldComponents}
    }),
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      // Handle form submission here
    },
  });

  const { values, errors, touched, handleSubmit, setFieldValue } = formik;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
${formFields}
      </div>
      
      <button
        type="submit"
        className="btn-primary"
      >
        Submit Form
      </button>
    </form>
  );
};

export default GeneratedForm;`;
  };

  const downloadCode = () => {
    const code = generateFormCode();
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GeneratedForm.jsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportFormData = () => {
    const exportData = {
      schema: {
        fields,
        metadata: {
          created: new Date().toISOString(),
          version: '1.0.0',
        },
      },
      currentData: formData,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (fields.length === 0) {
    return (
      <div className="preview-panel h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Add some fields to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel w-full h-full flex flex-col flex-1">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                title="Back to form builder"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-800">Form Preview</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={exportFormData}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Export form schema"
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={downloadCode}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Download generated code"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setPreviewMode('preview')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              previewMode === 'preview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-1" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('code')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              previewMode === 'code'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Code className="h-4 w-4 inline mr-1" />
            Code
          </button>
        </div>
      </div>

      <div className="flex-1 w-full h-full overflow-y-auto flex flex-col items-stretch">
        {previewMode === 'preview' ? (
          <div className="flex flex-1 w-full h-full p-4 lg:p-6 justify-center items-center">
            <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-2xl w-full">
              {submissionResult && (
                <div className={`p-4 rounded-lg ${
                  submissionResult.includes('successfully') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submissionResult}
                </div>
              )}

              <div className="space-y-4">
                {fields.map((field) => (
                  <FormFieldComponent
                    key={field.id}
                    field={field}
                    value={formik.values[field.id] || ''}
                    error={formik.errors[field.id] || errors[field.id]}
                    onChange={(value) => {
                      formik.setFieldValue(field.id, value);
                      onDataChange(field.id, value);
                    }}
                  />
                ))}
              </div>

              {fields.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Submit Form
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="p-4">
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {generateFormCode()}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
