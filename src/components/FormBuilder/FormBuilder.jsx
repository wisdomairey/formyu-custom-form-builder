import React, { useState } from 'react';
import useFormStore from '../../store/formStore';
import FieldPalette from './FieldPalette';
import FieldEditor from './FieldEditor';
import FieldList from './FieldList';
import { EyeIcon, PencilIcon, DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

const FormBuilder = () => {
  const { 
    isPreviewMode,
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

  if (isPreviewMode) {
    return null; // Preview component will handle this
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          {/* Center - Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              <span className="text-blue-600">FormYu</span>
              <span className="text-gray-700 font-medium"> - Form Builder</span>
            </h1>
            <p className="text-base text-gray-600">Create and customize professional forms with ease</p>
          </div>
        </div>
      </div>
      
      {/* Remove the separate Action Buttons Bar since buttons are now in the header */}
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Field Palette */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Field Types</h2>
            <p className="text-sm text-gray-600 mt-1">Click to add fields to your form</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FieldPalette />
          </div>
        </div>

        {/* Center - Form Canvas */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Form Title and Description */}
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                {/* Form Title */}
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                    className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full mb-2"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{formTitle}</h2>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Form Description */}
                {isEditingDescription ? (
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    onBlur={() => setIsEditingDescription(false)}
                    className="text-gray-600 bg-transparent border-none outline-none w-full resize-none"
                    placeholder="Add a description for your form..."
                    rows="2"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-start space-x-2">
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
            </div>
          </div>
          
          {/* Form Fields */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <FieldList />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Field Editor */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm">
          <FieldEditor />
        </div>
      </div>
      
      {/* Floating Action Buttons - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex flex-col space-y-6">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div className="flex items-center space-x-3 px-6 py-4 text-base font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all hover:scale-105 border border-gray-200 shadow-xl">
              <DocumentArrowUpIcon className="w-5 h-5" />
              <span>Import</span>
            </div>
          </label>

          <button
            onClick={handleExport}
            className="flex items-center space-x-3 px-6 py-4 text-base font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all hover:scale-105 border border-gray-200 shadow-xl"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Export</span>
          </button>

          <button
            onClick={togglePreviewMode}
            className="flex items-center space-x-3 px-6 py-4 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-xl"
          >
            <EyeIcon className="w-5 h-5" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
