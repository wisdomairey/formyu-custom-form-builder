import React from 'react';
import useFormStore from '../../store/formStore';
import { FIELD_TYPE_LABELS, CONDITIONAL_OPERATORS, CONDITIONAL_OPERATOR_LABELS, getFieldIcon } from '../../utils/fieldTypes';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FieldEditor = () => {
  const { 
    fields, 
    selectedFieldId, 
    updateField, 
    setSelectedField 
  } = useFormStore();

  const selectedField = fields.find(field => field.id === selectedFieldId);

  if (!selectedField) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 md:p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Field Settings</h3>
          <p className="text-xs md:text-sm text-gray-600">Configure field properties</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl md:text-2xl">⚙️</span>
            </div>
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No Field Selected</h3>
            <p className="text-sm md:text-base text-gray-600 max-w-sm">
              Click on a field in the form canvas to start editing its properties and settings.
            </p>
            <div className="mt-4 text-xs md:text-sm text-gray-500">
              👈 Select a field to configure
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleFieldUpdate = (property, value) => {
    updateField(selectedFieldId, { [property]: value });
  };

  const handleValidationUpdate = (property, value) => {
    updateField(selectedFieldId, {
      validation: {
        ...selectedField.validation,
        [property]: value
      }
    });
  };

  const handleConditionalLogicUpdate = (property, value) => {
    updateField(selectedFieldId, {
      conditionalLogic: {
        ...selectedField.conditionalLogic,
        [property]: value
      }
    });
  };

  const handleOptionUpdate = (index, value) => {
    const newOptions = [...selectedField.options];
    newOptions[index] = value;
    updateField(selectedFieldId, { options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...selectedField.options, `Option ${selectedField.options.length + 1}`];
    updateField(selectedFieldId, { options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = selectedField.options.filter((_, i) => i !== index);
    updateField(selectedFieldId, { options: newOptions });
  };

  const availableFields = fields.filter(field => field.id !== selectedFieldId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-base md:text-lg">{getFieldIcon(selectedField.type)}</span>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Field Settings</h3>
            <p className="text-xs md:text-sm text-gray-600">{FIELD_TYPE_LABELS[selectedField.type]}</p>
          </div>
        </div>
        <button
          onClick={() => setSelectedField(null)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Settings */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-4 md:space-y-6">
        {/* Basic Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Basic Settings
          </h4>
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Field Label *
              </label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => handleFieldUpdate('label', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter field label"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Placeholder Text
              </label>
              <input
                type="text"
                value={selectedField.placeholder}
                onChange={(e) => handleFieldUpdate('placeholder', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter placeholder text"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <label htmlFor="required" className="text-xs md:text-sm font-medium text-gray-700">
                  Required field
                </label>
                <p className="text-xs text-gray-500">Make this field mandatory</p>
              </div>
              <input
                type="checkbox"
                id="required"
                checked={selectedField.required}
                onChange={(e) => handleFieldUpdate('required', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Options for choice fields */}
        {(selectedField.type === 'select' || selectedField.type === 'radio' || selectedField.type === 'checkbox') && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Options</h4>
            <div className="space-y-2">
              {selectedField.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionUpdate(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                    disabled={selectedField.options.length <= 1}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-700"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {/* Validation Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Validation</h4>
          <div className="space-y-4">
            {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    value={selectedField.validation.minLength || ''}
                    onChange={(e) => handleValidationUpdate('minLength', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Length
                  </label>
                  <input
                    type="number"
                    value={selectedField.validation.maxLength || ''}
                    onChange={(e) => handleValidationUpdate('maxLength', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pattern (Regex)
                  </label>
                  <input
                    type="text"
                    value={selectedField.validation.pattern || ''}
                    onChange={(e) => handleValidationUpdate('pattern', e.target.value)}
                    placeholder="e.g., ^[A-Za-z]+$"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Conditional Logic */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Conditional Logic</h4>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="conditionalEnabled"
                checked={selectedField.conditionalLogic.enabled}
                onChange={(e) => handleConditionalLogicUpdate('enabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="conditionalEnabled" className="ml-2 text-sm text-gray-700">
                Enable conditional logic
              </label>
            </div>

            {selectedField.conditionalLogic.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Show this field when
                  </label>
                  <select
                    value={selectedField.conditionalLogic.showWhen || ''}
                    onChange={(e) => handleConditionalLogicUpdate('showWhen', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a field</option>
                    {availableFields.map(field => (
                      <option key={field.id} value={field.id}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={selectedField.conditionalLogic.condition}
                    onChange={(e) => handleConditionalLogicUpdate('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(CONDITIONAL_OPERATOR_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {(selectedField.conditionalLogic.condition === CONDITIONAL_OPERATORS.EQUALS || 
                  selectedField.conditionalLogic.condition === CONDITIONAL_OPERATORS.NOT_EQUALS ||
                  selectedField.conditionalLogic.condition === CONDITIONAL_OPERATORS.CONTAINS) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={selectedField.conditionalLogic.value}
                      onChange={(e) => handleConditionalLogicUpdate('value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;
