import React, { useState } from 'react';
import useFormStore from '../../store/formStore';
import { EyeIcon, PencilIcon, DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

const FormHeader = () => {
  const { 
    formTitle, 
    formDescription, 
    setFormTitle, 
    setFormDescription, 
    togglePreviewMode,
    exportForm,
    importForm
  } = useFormStore();
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleExport = () => {
    const formData = exportForm();
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formTitle.replace(/\s+/g, '_')}_form.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const formData = JSON.parse(e.target.result);
          importForm(formData);
        } catch {
          alert('Invalid form file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1 mr-8">
          {/* Form Title */}
          {isEditingTitle ? (
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
              autoFocus
            />
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">{formTitle}</h1>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form Description */}
          {isEditingDescription ? (
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              onBlur={() => setIsEditingDescription(false)}
              className="mt-1 text-gray-600 bg-transparent border-none outline-none w-full resize-none"
              placeholder="Add a description for your form..."
              rows="2"
              autoFocus
            />
          ) : (
            <div className="flex items-start space-x-2 mt-1">
              <p 
                className="text-gray-600 cursor-pointer"
                onClick={() => setIsEditingDescription(true)}
              >
                {formDescription || 'Add a description for your form...'}
              </p>
              <button
                onClick={() => setIsEditingDescription(true)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors hover:scale-105 border border-gray-200"
            >
              <DocumentArrowUpIcon className="w-4 h-4" />
              <span>Import</span>
            </div>
          </label>

          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors hover:scale-105 border border-gray-200"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Export</span>
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={togglePreviewMode}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors hover:scale-105 shadow-sm"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
