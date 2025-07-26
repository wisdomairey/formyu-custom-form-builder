import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useFormStore = create((set, get) => ({
  // Form configuration
  formTitle: 'Untitled Form',
  formDescription: '',
  
  // Form fields array
  fields: [],
  
  // Current selected field for editing
  selectedFieldId: null,
  
  // Form responses (for preview mode)
  formResponses: {},
  
  // Preview mode toggle
  isPreviewMode: false,

  // Actions
  setFormTitle: (title) => set({ formTitle: title }),
  
  setFormDescription: (description) => set({ formDescription: description }),
  
  addField: (fieldType) => {
    const newField = {
      id: uuidv4(),
      type: fieldType,
      label: `${fieldType} Field`,
      placeholder: '',
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? ['Option 1'] : [],
      conditionalLogic: {
        enabled: false,
        showWhen: null,
        condition: 'equals',
        value: ''
      },
      validation: {
        minLength: null,
        maxLength: null,
        pattern: null
      }
    };
    
    set((state) => ({
      fields: [...state.fields, newField],
      selectedFieldId: newField.id
    }));
  },
  
  updateField: (fieldId, updates) => {
    set((state) => ({
      fields: state.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  },
  
  removeField: (fieldId) => {
    set((state) => ({
      fields: state.fields.filter(field => field.id !== fieldId),
      selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId
    }));
  },
  
  reorderFields: (dragIndex, hoverIndex) => {
    set((state) => {
      const newFields = [...state.fields];
      const draggedField = newFields[dragIndex];
      newFields.splice(dragIndex, 1);
      newFields.splice(hoverIndex, 0, draggedField);
      return { fields: newFields };
    });
  },
  
  setSelectedField: (fieldId) => set({ selectedFieldId: fieldId }),
  
  togglePreviewMode: () => set((state) => ({ 
    isPreviewMode: !state.isPreviewMode,
    selectedFieldId: null 
  })),
  
  updateFormResponse: (fieldId, value) => {
    set((state) => ({
      formResponses: {
        ...state.formResponses,
        [fieldId]: value
      }
    }));
  },
  
  clearFormResponses: () => set({ formResponses: {} }),
  
  // Helper to check if field should be visible based on conditional logic
  isFieldVisible: (field) => {
    const { formResponses, fields } = get();
    
    if (!field.conditionalLogic.enabled || !field.conditionalLogic.showWhen) {
      return true;
    }
    
    const dependentField = fields.find(f => f.id === field.conditionalLogic.showWhen);
    if (!dependentField) return true;
    
    const responseValue = formResponses[field.conditionalLogic.showWhen];
    const expectedValue = field.conditionalLogic.value;
    
    switch (field.conditionalLogic.condition) {
      case 'equals':
        return responseValue === expectedValue;
      case 'not_equals':
        return responseValue !== expectedValue;
      case 'contains':
        return responseValue && responseValue.includes(expectedValue);
      case 'not_empty':
        return responseValue && responseValue.length > 0;
      case 'empty':
        return !responseValue || responseValue.length === 0;
      default:
        return true;
    }
  },
  
  // Export form configuration
  exportForm: () => {
    const { formTitle, formDescription, fields } = get();
    return {
      title: formTitle,
      description: formDescription,
      fields: fields,
      createdAt: new Date().toISOString()
    };
  },
  
  // Import form configuration
  importForm: (formConfig) => {
    set({
      formTitle: formConfig.title || 'Untitled Form',
      formDescription: formConfig.description || '',
      fields: formConfig.fields || [],
      selectedFieldId: null,
      formResponses: {}
    });
  }
}));

export default useFormStore;
