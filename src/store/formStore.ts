import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { FormBuilderState, FormField, FormSchema, FormData } from '../types/form';

// Helper function to create a new field with default values
const createDefaultField = (type: FormField['type']): Omit<FormField, 'id' | 'order'> => {
  const baseField = {
    type,
    label: `New ${type} field`,
    placeholder: '',
    required: false,
    validation: [],
    conditionalRules: [],
    description: '',
  };

  switch (type) {
    case 'select':
    case 'radio':
    case 'checkbox':
      return {
        ...baseField,
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
      };
    case 'email':
      return {
        ...baseField,
        validation: [
          { type: 'email', message: 'Please enter a valid email address' },
        ],
      };
    case 'number':
      return {
        ...baseField,
        defaultValue: 0,
      };
    case 'textarea':
      return {
        ...baseField,
        placeholder: 'Enter your message here...',
      };
    default:
      return baseField;
  }
};

// Helper function to check if a field should be visible based on conditional rules
const shouldFieldBeVisible = (field: FormField, formData: FormData): boolean => {
  if (field.conditionalRules.length === 0) return true;

  return field.conditionalRules.every(rule => {
    const triggerFieldValue = formData[rule.fieldId];
    
    switch (rule.operator) {
      case 'equals':
        return triggerFieldValue === rule.value;
      case 'not_equals':
        return triggerFieldValue !== rule.value;
      case 'contains':
        return String(triggerFieldValue).includes(String(rule.value));
      case 'greater_than':
        return Number(triggerFieldValue) > Number(rule.value);
      case 'less_than':
        return Number(triggerFieldValue) < Number(rule.value);
      default:
        return true;
    }
  });
};

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  // Initial state
  currentForm: null,
  fields: [],
  selectedField: null,
  draggedField: null,
  previewData: {},
  previewErrors: {},
  isPreviewMode: false,
  sidebarTab: 'fields',

  // Field management actions
  addField: (fieldData) => {
    const newField: FormField = {
      ...fieldData,
      id: uuidv4(),
      order: get().fields.length,
    };
    
    set((state) => ({
      fields: [...state.fields, newField],
      selectedField: newField,
    }));
  },

  updateField: (fieldId, updates) => {
    set((state) => ({
      fields: state.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
      selectedField: state.selectedField?.id === fieldId 
        ? { ...state.selectedField, ...updates }
        : state.selectedField,
    }));
  },

  deleteField: (fieldId) => {
    set((state) => ({
      fields: state.fields.filter(field => field.id !== fieldId),
      selectedField: state.selectedField?.id === fieldId ? null : state.selectedField,
      previewData: Object.fromEntries(
        Object.entries(state.previewData).filter(([id]) => id !== fieldId)
      ),
      previewErrors: Object.fromEntries(
        Object.entries(state.previewErrors).filter(([id]) => id !== fieldId)
      ),
    }));
  },

  reorderFields: (fromIndex, toIndex) => {
    set((state) => {
      const newFields = [...state.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      
      // Update order property
      return {
        fields: newFields.map((field, index) => ({ ...field, order: index })),
      };
    });
  },

  selectField: (field) => {
    set({ selectedField: field });
  },

  setDraggedField: (field) => {
    set({ draggedField: field });
  },

  // Preview actions
  updatePreviewData: (fieldId, value) => {
    set((state) => ({
      previewData: {
        ...state.previewData,
        [fieldId]: value,
      },
    }));
    
    // Clear error when user starts typing
    get().setPreviewError(fieldId, '');
  },

  setPreviewError: (fieldId, error) => {
    set((state) => ({
      previewErrors: {
        ...state.previewErrors,
        [fieldId]: error,
      },
    }));
  },

  clearPreviewErrors: () => {
    set({ previewErrors: {} });
  },

  // Form management
  createNewForm: (title) => {
    const newForm: FormSchema = {
      id: uuidv4(),
      title,
      description: '',
      fields: [],
      settings: {
        allowMultipleSubmissions: true,
        showProgressBar: false,
        confirmationMessage: 'Thank you for your submission!',
        saveToLocalStorage: true,
      },
      created: new Date(),
      updated: new Date(),
    };

    set({
      currentForm: newForm,
      fields: [],
      selectedField: null,
      previewData: {},
      previewErrors: {},
    });
  },

  loadForm: (form) => {
    set({
      currentForm: form,
      fields: form.fields.sort((a, b) => a.order - b.order),
      selectedField: null,
      previewData: {},
      previewErrors: {},
    });
  },

  saveForm: () => {
    const state = get();
    if (!state.currentForm) return null;

    const updatedForm: FormSchema = {
      ...state.currentForm,
      fields: state.fields,
      updated: new Date(),
    };

    set({ currentForm: updatedForm });
    
    // Save to localStorage if enabled
    if (updatedForm.settings.saveToLocalStorage) {
      const savedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
      const existingIndex = savedForms.findIndex((f: FormSchema) => f.id === updatedForm.id);
      
      if (existingIndex >= 0) {
        savedForms[existingIndex] = updatedForm;
      } else {
        savedForms.push(updatedForm);
      }
      
      localStorage.setItem('formBuilderForms', JSON.stringify(savedForms));
    }

    return updatedForm;
  },

  exportFormSchema: () => {
    const state = get();
    const exportData = {
      form: state.currentForm,
      fields: state.fields,
      exportedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(exportData, null, 2);
  },

  importFormSchema: (schema) => {
    try {
      const data = JSON.parse(schema);
      if (data.form && data.fields) {
        get().loadForm(data.form);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import form schema:', error);
      return false;
    }
  },

  // UI actions
  setPreviewMode: (isPreview) => {
    set({ isPreviewMode: isPreview });
  },

  setSidebarTab: (tab) => {
    set({ sidebarTab: tab });
  },
}));

// Helper functions for components
export const useVisibleFields = () => {
  const fields = useFormBuilderStore(state => state.fields);
  const previewData = useFormBuilderStore(state => state.previewData);
  
  return fields.filter(field => shouldFieldBeVisible(field, previewData));
};

export const useFieldTemplates = () => {
  return [
    { type: 'text' as const, label: 'Text Input', icon: '📝' },
    { type: 'textarea' as const, label: 'Text Area', icon: '📄' },
    { type: 'email' as const, label: 'Email', icon: '📧' },
    { type: 'number' as const, label: 'Number', icon: '🔢' },
    { type: 'date' as const, label: 'Date', icon: '📅' },
    { type: 'select' as const, label: 'Dropdown', icon: '📋' },
    { type: 'radio' as const, label: 'Radio Buttons', icon: '⚪' },
    { type: 'checkbox' as const, label: 'Checkboxes', icon: '☑️' },
    { type: 'file' as const, label: 'File Upload', icon: '📎' },
  ].map(template => ({
    ...template,
    create: () => createDefaultField(template.type),
  }));
};
