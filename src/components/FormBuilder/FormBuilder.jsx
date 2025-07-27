import React, { useState } from 'react';
import useFormStore from '../../store/formStore';
import FieldPalette from './FieldPalette';
import FieldEditor from './FieldEditor';
import FieldList from './FieldList';
import { 
  EyeIcon, 
  PencilIcon, 
  DocumentArrowDownIcon, 
  DocumentArrowUpIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

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
  const [showMobileFieldPalette, setShowMobileFieldPalette] = useState(false);
  const [showMobileFieldEditor, setShowMobileFieldEditor] = useState(false);

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
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-6 shadow-sm">
        <div className="flex items-center justify-between max-w-8xl mx-auto">
          {/* Mobile Menu Buttons */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setShowMobileFieldPalette(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              aria-label="Open field palette"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowMobileFieldEditor(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              aria-label="Open field editor"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Center - Heading */}
          <div className="text-center flex-1 md:flex-none">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
              <span className="text-blue-600">FormYu</span>
              <span className="text-gray-700 font-medium"> - Form Builder</span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 hidden sm:block">Create and customize professional forms with ease</p>
          </div>

          {/* Desktop Preview Button */}
          <div className="hidden md:block">
            <button
              onClick={togglePreviewMode}
              className="px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium"
            >
              <div className="flex items-center space-x-2">
                <EyeIcon className="w-5 h-5" />
                <span>Preview Form</span>
              </div>
            </button>
          </div>

          {/* Mobile Preview Button */}
          <div className="md:hidden">
            <button
              onClick={togglePreviewMode}
              className="px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium text-sm"
              aria-label="Preview form"
            >
              <div className="flex items-center space-x-2">
                <EyeIcon className="w-5 h-5" />
                <span>Preview</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Field Palette (Desktop) */}
        <div className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col shadow-sm">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Field Types</h2>
            <p className="text-sm text-gray-600 mt-1">Click to add fields to your form</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FieldPalette />
          </div>
        </div>

        {/* Center - Form Canvas */}
        <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
          {/* Form Title and Description */}
          <div className="p-4 md:p-6 bg-white border-b border-gray-200">
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
                    className="text-xl md:text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full mb-2"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{formTitle}</h2>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                )}

                {/* Form Description */}
                {isEditingDescription ? (
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    onBlur={() => setIsEditingDescription(false)}
                    className="text-gray-600 bg-transparent border-none outline-none w-full resize-none text-sm md:text-base"
                    placeholder="Add a description for your form..."
                    rows="2"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-start space-x-2">
                    <p 
                      className="text-gray-600 cursor-pointer text-sm md:text-base"
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
          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <FieldList />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Field Editor (Desktop) */}
        <div className="hidden lg:flex w-80 bg-white border-l border-gray-200 flex-col shadow-sm">
          <FieldEditor />
        </div>
      </div>

      {/* Mobile Field Palette Modal */}
      {showMobileFieldPalette && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFieldPalette(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Field Types</h2>
              <button
                onClick={() => setShowMobileFieldPalette(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FieldPalette />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Field Editor Modal */}
      {showMobileFieldEditor && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFieldEditor(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Field Editor</h2>
              <button
                onClick={() => setShowMobileFieldEditor(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1">
              <FieldEditor />
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Action Buttons - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-40 hidden md:block">
        <div className="flex flex-col space-y-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all hover:scale-105 border border-gray-200 shadow-xl">
              <DocumentArrowUpIcon className="w-5 h-5" />
              <span>Import</span>
            </div>
          </label>

          <button
            onClick={handleExport}
            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all hover:scale-105 border border-gray-200 shadow-xl"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Export</span>
          </button>

          <button
            onClick={togglePreviewMode}
            className="flex items-center space-x-3 px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-110 shadow-2xl border-2 border-white/20 hover:shadow-blue-500/25"
          >
            <EyeIcon className="w-6 h-6" />
            <span>Preview Form</span>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex justify-center space-x-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <DocumentArrowUpIcon className="w-4 h-4" />
              <span>Import</span>
            </div>
          </label>

          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
