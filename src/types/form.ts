// Types for the Custom Form Builder

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'number' 
  | 'email' 
  | 'date'
  | 'file';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'pattern' | 'min' | 'max';
  value?: string | number;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface ConditionalRule {
  id: string;
  fieldId: string; // Field that triggers the condition
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number | boolean;
  action: 'show' | 'hide' | 'require' | 'disable';
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: SelectOption[]; // For select, radio, checkbox fields
  validation: ValidationRule[];
  conditionalRules: ConditionalRule[];
  order: number;
  description?: string;
  defaultValue?: string | number | boolean | string[];
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  created: Date;
  updated: Date;
}

export interface FormSettings {
  allowMultipleSubmissions: boolean;
  showProgressBar: boolean;
  confirmationMessage: string;
  redirectUrl?: string;
  saveToLocalStorage: boolean;
}

export type FieldValue = string | number | boolean | string[] | File[];

export interface FormData {
  [fieldId: string]: FieldValue;
}

export interface FormBuilderState {
  // Current form being built
  currentForm: FormSchema | null;
  
  // Fields management
  fields: FormField[];
  selectedField: FormField | null;
  draggedField: FormField | null;
  
  // Preview state
  previewData: FormData;
  previewErrors: { [fieldId: string]: string };
  
  // UI state
  isPreviewMode: boolean;
  sidebarTab: 'fields' | 'settings' | 'logic';
  
  // Actions
  addField: (field: Omit<FormField, 'id' | 'order'>) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (fieldId: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  selectField: (field: FormField | null) => void;
  setDraggedField: (field: FormField | null) => void;
  
  // Preview actions
  updatePreviewData: (fieldId: string, value: FieldValue) => void;
  setPreviewError: (fieldId: string, error: string) => void;
  clearPreviewErrors: () => void;
  
  // Form management
  createNewForm: (title: string) => void;
  loadForm: (form: FormSchema) => void;
  saveForm: () => FormSchema | null;
  exportFormSchema: () => string;
  importFormSchema: (schema: string) => boolean;
  
  // UI actions
  setPreviewMode: (isPreview: boolean) => void;
  setSidebarTab: (tab: 'fields' | 'settings' | 'logic') => void;
}

export interface FieldEditorProps {
  field: FormField | null;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
}

export interface PreviewPanelProps {
  fields: FormField[];
  formData: FormData;
  errors: { [fieldId: string]: string };
  onDataChange: (fieldId: string, value: FieldValue) => void;
  onBack?: () => void;
}

export interface FormFieldComponentProps {
  field: FormField;
  value: FieldValue;
  error?: string;
  onChange: (value: FieldValue) => void;
  disabled?: boolean;
}

import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import type { SensorDescriptor } from '@dnd-kit/core';

export interface DragDropContextType {
  activeId: string | null;
  sensors: SensorDescriptor<Record<string, unknown>>[];
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
}
