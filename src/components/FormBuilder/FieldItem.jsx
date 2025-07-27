import React from 'react';
import useFormStore from '../../store/formStore';
import { FIELD_TYPE_LABELS, getFieldIcon } from '../../utils/fieldTypes';
import { 
  TrashIcon, 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

const FieldItem = ({ field, index }) => {
  const { 
    selectedFieldId, 
    setSelectedField, 
    removeField, 
    updateField 
  } = useFormStore();
  
  const isSelected = selectedFieldId === field.id;

  const handleSelect = () => {
    setSelectedField(field.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    removeField(field.id);
  };

  const toggleRequired = (e) => {
    e.stopPropagation();
    updateField(field.id, { required: !field.required });
  };

  const toggleConditionalLogic = (e) => {
    e.stopPropagation();
    updateField(field.id, {
      conditionalLogic: {
        ...field.conditionalLogic,
        enabled: !field.conditionalLogic.enabled
      }
    });
  };

  return (
    <div
      className={`
        relative p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] bg-white
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
      `}
      onClick={handleSelect}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">{getFieldIcon(field.type)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900 truncate">{field.label}</h4>
              {field.required && (
                <span className="text-red-500 text-sm font-medium">*</span>
              )}
              {field.conditionalLogic.enabled && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Conditional
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-500">
                {FIELD_TYPE_LABELS[field.type]}
              </p>
              {field.placeholder && (
                <span className="text-xs text-gray-400">• {field.placeholder}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={toggleRequired}
            className={`
              px-2 py-1 rounded text-xs font-medium transition-colors
              ${field.required 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            title={field.required ? 'Remove required' : 'Make required'}
          >
            {field.required ? 'Required' : 'Optional'}
          </button>

          <button
            onClick={toggleConditionalLogic}
            className={`
              p-2 rounded transition-colors
              ${field.conditionalLogic.enabled 
                ? 'text-yellow-600 hover:text-yellow-700 bg-yellow-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }
            `}
            title={field.conditionalLogic.enabled ? 'Disable conditional logic' : 'Enable conditional logic'}
          >
            {field.conditionalLogic.enabled ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
          </button>

          <button
            onClick={handleSelect}
            className={`
              p-2 rounded transition-colors
              ${isSelected 
                ? 'text-blue-600 bg-blue-100' 
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }
            `}
            title="Edit field"
          >
            <PencilIcon className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete field"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldItem;
