import React, { useState } from 'react';
import { Trash2, Plus, Minus, Settings } from 'lucide-react';
import type { FieldEditorProps, ValidationRule, SelectOption } from '../types/form';

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'validation' | 'conditions'>('basic');

  if (!field) {
    return (
      <div className="field-editor h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateField = (updates: Partial<typeof field>) => {
    onUpdate(updates);
  };

  const addOption = () => {
    const newOption: SelectOption = {
      label: `Option ${(field.options?.length || 0) + 1}`,
      value: `option${(field.options?.length || 0) + 1}`,
    };
    updateField({
      options: [...(field.options || []), newOption],
    });
  };

  const updateOption = (index: number, updates: Partial<SelectOption>) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], ...updates };
    updateField({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    updateField({ options: newOptions });
  };

  const addValidationRule = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: 'This field is required',
    };
    updateField({
      validation: [...field.validation, newRule],
    });
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...field.validation];
    newRules[index] = { ...newRules[index], ...updates };
    updateField({ validation: newRules });
  };

  const removeValidationRule = (index: number) => {
    const newRules = [...field.validation];
    newRules.splice(index, 1);
    updateField({ validation: newRules });
  };

  const renderBasicTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Type
        </label>
        <select
          value={field.type}
          onChange={(e) => updateField({ type: e.target.value as typeof field.type })}
          className="input-field"
        >
          <option value="text">Text Input</option>
          <option value="textarea">Text Area</option>
          <option value="email">Email</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="select">Dropdown</option>
          <option value="radio">Radio Buttons</option>
          <option value="checkbox">Checkboxes</option>
          <option value="file">File Upload</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Label *
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField({ label: e.target.value })}
          className="input-field"
          placeholder="Enter field label"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Placeholder
        </label>
        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => updateField({ placeholder: e.target.value })}
          className="input-field"
          placeholder="Enter placeholder text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={field.description || ''}
          onChange={(e) => updateField({ description: e.target.value })}
          className="input-field min-h-[60px]"
          placeholder="Optional field description"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="required"
          checked={field.required}
          onChange={(e) => updateField({ required: e.target.checked })}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="required" className="text-sm text-gray-700">
          Required field
        </label>
      </div>

      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(index, { label: e.target.value })}
                  className="input-field flex-1"
                  placeholder="Option label"
                />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => updateOption(index, { value: e.target.value })}
                  className="input-field w-24"
                  placeholder="Value"
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-800"
            >
              <Plus className="h-4 w-4" />
              <span>Add Option</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderValidationTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Validation Rules</h3>
        <button
          type="button"
          onClick={addValidationRule}
          className="btn-secondary text-xs py-1 px-2"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Rule
        </button>
      </div>

      {field.validation.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No validation rules added</p>
      ) : (
        <div className="space-y-3">
          {field.validation.map((rule, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <select
                  value={rule.type}
                  onChange={(e) => updateValidationRule(index, { type: e.target.value as ValidationRule['type'] })}
                  className="input-field text-sm"
                >
                  <option value="required">Required</option>
                  <option value="minLength">Minimum Length</option>
                  <option value="maxLength">Maximum Length</option>
                  <option value="email">Email Format</option>
                  <option value="pattern">Regular Expression</option>
                  <option value="min">Minimum Value</option>
                  <option value="max">Maximum Value</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeValidationRule(index)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {(rule.type === 'minLength' || rule.type === 'maxLength' || rule.type === 'min' || rule.type === 'max') && (
                <input
                  type="number"
                  value={rule.value || ''}
                  onChange={(e) => updateValidationRule(index, { value: e.target.value })}
                  className="input-field text-sm"
                  placeholder="Enter value"
                />
              )}

              {rule.type === 'pattern' && (
                <input
                  type="text"
                  value={rule.value || ''}
                  onChange={(e) => updateValidationRule(index, { value: e.target.value })}
                  className="input-field text-sm"
                  placeholder="Enter regex pattern"
                />
              )}

              <input
                type="text"
                value={rule.message}
                onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                className="input-field text-sm"
                placeholder="Error message"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderConditionsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Conditional Logic</h3>
        <button
          type="button"
          className="btn-secondary text-xs py-1 px-2"
          disabled
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Condition
        </button>
      </div>
      <p className="text-sm text-gray-500 italic">
        Conditional logic will be implemented in a future version
      </p>
    </div>
  );

  return (
    <div className="field-editor h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Field</h2>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
            title="Delete field"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'basic'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Basic
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('validation')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'validation'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Validation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('conditions')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'conditions'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Conditions
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'basic' && renderBasicTab()}
        {activeTab === 'validation' && renderValidationTab()}
        {activeTab === 'conditions' && renderConditionsTab()}
      </div>
    </div>
  );
};

export default FieldEditor;
