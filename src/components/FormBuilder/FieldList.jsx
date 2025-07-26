import React from 'react';
import useFormStore from '../../store/formStore';
import FieldItem from './FieldItem';

const FieldList = () => {
  const { fields } = useFormStore();

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm ">
        <div className="text-7xl mb-8">📝</div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Start Building Your Form</h3>
        <div className="flex justify-center mb-12">
          <p className="text-gray-600 max-w-lg text-lg leading-relaxed text-center">
            Click on field types from the left panel to add them to your form. 
            You can then configure each field using the editor on the right.
          </p>
        </div>
        
        {/* Step indicators */}
        <div className="max-w-3xl mx-auto ">
          <div className="flex items-center gap-10 justify-center space-x-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <span className="text-3xl">👈</span>
              </div>
              <div className="text-base font-semibold text-gray-800 mb-2">Step 1</div>
              <div className="text-sm text-gray-600 leading-relaxed max-w-24">
                Select a field type
              </div>
            </div>
            
            <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 to-green-200 max-w-24 mx-6"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <span className="text-3xl">⚙️</span>
              </div>
              <div className="text-base font-semibold text-gray-800 mb-2">Step 2</div>
              <div className="text-sm text-gray-600 leading-relaxed max-w-24">
                Configure properties
              </div>
            </div>
            
            <div className="flex-1 h-0.5 bg-gradient-to-r from-green-200 to-purple-200 max-w-24 mx-6"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <span className="text-3xl">👀</span>
              </div>
              <div className="text-base font-semibold text-gray-800 mb-2">Step 3</div>
              <div className="text-sm text-gray-600 leading-relaxed max-w-24">
                Preview & test
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick start hint */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <span className="text-sm">💡</span>
            <span className="text-sm font-medium">Quick Start:</span>
            <span className="text-sm">Try adding a "Text Input" field first!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
