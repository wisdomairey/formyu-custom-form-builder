import React from 'react';
import useFormStore from '../../store/formStore';
import FieldItem from './FieldItem';

const FieldList = () => {
  const { fields } = useFormStore();

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 md:gap-5 text-center py-12 md:py-20 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm ">
        <div className="text-5xl md:text-7xl mb-4 md:mb-8">📝</div>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Start Building Your Form</h3>
        <div className="flex justify-center mb-8 md:mb-12">
          <p className="text-gray-600 max-w-lg text-base md:text-lg leading-relaxed text-center px-4">
            Click on field types from the left panel to add them to your form. 
            You can then configure each field using the editor on the right.
          </p>
        </div>
        
        {/* Step indicators */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-4 md:gap-10 justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                <span className="text-2xl md:text-3xl">👈</span>
              </div>
              <div className="text-sm md:text-base font-semibold text-gray-800 mb-2">Step 1</div>
              <div className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-20 md:max-w-24">
                Select a field type
              </div>
            </div>
            
            <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 to-green-200 max-w-16 md:max-w-24 mx-2 md:mx-6"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                <span className="text-2xl md:text-3xl">⚙️</span>
              </div>
              <div className="text-sm md:text-base font-semibold text-gray-800 mb-2">Step 2</div>
              <div className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-20 md:max-w-24">
                Configure properties
              </div>
            </div>
            
            <div className="flex-1 h-0.5 bg-gradient-to-r from-green-200 to-purple-200 max-w-16 md:max-w-24 mx-2 md:mx-6"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                <span className="text-2xl md:text-3xl">👀</span>
              </div>
              <div className="text-sm md:text-base font-semibold text-gray-800 mb-2">Step 3</div>
              <div className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-20 md:max-w-24">
                Preview & test
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick start hint */}
        <div className="mt-6 md:mt-8 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <span className="text-sm">💡</span>
            <span className="text-xs md:text-sm font-medium">Quick Start:</span>
            <span className="text-xs md:text-sm">Try adding a "Text Input" field first!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="fade-in"
        >
          <FieldItem field={field} index={index} />
        </div>
      ))}
    </div>
  );
};

export default FieldList;
