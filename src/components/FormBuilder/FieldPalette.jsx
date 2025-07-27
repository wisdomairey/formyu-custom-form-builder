import React from 'react';
import useFormStore from '../../store/formStore';
import { FIELD_TYPES, FIELD_TYPE_LABELS, getFieldIcon } from '../../utils/fieldTypes';

const FieldPalette = () => {
  const { addField } = useFormStore();

  const fieldCategories = [
    {
      name: 'Basic Fields',
      fields: [
        FIELD_TYPES.TEXT,
        FIELD_TYPES.EMAIL,
        FIELD_TYPES.PASSWORD,
        FIELD_TYPES.NUMBER,
        FIELD_TYPES.TEXTAREA,
        FIELD_TYPES.PHONE,
        FIELD_TYPES.URL
      ]
    },
    {
      name: 'Choice Fields',
      fields: [
        FIELD_TYPES.SELECT,
        FIELD_TYPES.RADIO,
        FIELD_TYPES.CHECKBOX
      ]
    },
    {
      name: 'Special Fields',
      fields: [
        FIELD_TYPES.DATE,
        FIELD_TYPES.FILE
      ]
    }
  ];

  return (
    <div className="p-3 md:p-4 space-y-6 md:space-y-8">
      {fieldCategories.map((category) => (
        <div key={category.name} className="space-y-3 md:space-y-4">
          {/* Enhanced Category Header */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 md:p-4 border border-blue-100 shadow-sm">
              <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 md:mr-3"></div>
                {category.name}
                <div className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {category.fields.length}
                </div>
              </h3>
            </div>
          </div>
          
          {/* Field Options with Enhanced Styling */}
          <div className="grid grid-cols-1 gap-2 md:gap-3 pl-1 md:pl-2">
            {category.fields.map((fieldType) => (
              <button
                key={fieldType}
                onClick={() => addField(fieldType)}
                className="w-full p-3 md:p-4 text-left border border-gray-200 rounded-lg md:rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group hover:shadow-md bg-white hover:scale-[1.02] transform"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg md:rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200 shadow-sm">
                    <span className="text-base md:text-lg">{getFieldIcon(fieldType)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                      {FIELD_TYPE_LABELS[fieldType]}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                      Click to add
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FieldPalette;
