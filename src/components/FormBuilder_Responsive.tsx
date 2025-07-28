import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Edit3, 
  Trash2, 
  Settings, 
  Save,
  FileDown,
  FileUp,
  Eye,
  EyeOff,
  Menu,
  X
} from 'lucide-react';
import { useFormBuilderStore, useFieldTemplates } from '../store/formStore';
import FieldEditor from './FieldEditor';
import PreviewPanel from './PreviewPanel';
import FormFieldComponent from './FormFieldComponent';
import type { FormField } from '../types/form';

interface FieldTemplate {
  type: string;
  label: string;
  icon: string;
  create: () => Omit<FormField, 'id' | 'order'>;
}

// Sortable field item component
const SortableFieldItem: React.FC<{ 
  field: FormField; 
  isSelected: boolean; 
  onSelect: () => void; 
  onDelete: () => void;
}> = ({
  field,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`form-field group relative ${
        isDragging ? 'opacity-50' : ''
      } ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
    >
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          className="form-field-handle p-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="ml-8 mr-16">
        <FormFieldComponent
          field={field}
          value={''}
          onChange={() => {}}
          disabled
        />
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button
          type="button"
          onClick={onSelect}
          className="p-1 text-gray-400 hover:text-primary-600"
          title="Edit field"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-600"
          title="Delete field"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const FormBuilder: React.FC = () => {
  const {
    fields,
    selectedField,
    previewData,
    previewErrors,
    isPreviewMode,
    addField,
    updateField,
    deleteField,
    reorderFields,
    selectField,
    updatePreviewData,
    setPreviewMode,
    saveForm,
    exportFormSchema,
  } = useFormBuilderStore();

  const fieldTemplates = useFieldTemplates();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFieldEditorOpen, setIsFieldEditorOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      reorderFields(oldIndex, newIndex);
    }

    setActiveId(null);
  };

  const handleAddField = (template: FieldTemplate) => {
    addField(template.create());
    setIsSidebarOpen(false); // Close sidebar on mobile after adding field
  };

  const handleSaveForm = () => {
    const savedForm = saveForm();
    if (savedForm) {
      alert('Form saved successfully!');
    }
  };

  const handleExportForm = () => {
    const schema = exportFormSchema();
    const blob = new Blob([schema], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportForm = () => {
    try {
      // Implementation for importing form would go here
      setShowImportDialog(false);
      setImportData('');
      alert('Import functionality will be implemented in a future version.');
    } catch {
      alert('Failed to import form. Please check the format.');
    }
  };

  const handleFieldSelect = (field: FormField) => {
    selectField(field);
    setIsFieldEditorOpen(true); // Open field editor on mobile
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Form Builder</h1>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!isPreviewMode)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
              title={isPreviewMode ? "Exit preview" : "Preview form"}
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {!isPreviewMode && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                title="Toggle sidebar"
              >
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Field Library */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto lg:w-80 lg:flex lg:flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isPreviewMode ? 'hidden lg:hidden' : ''}
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 hidden lg:block">Form Builder</h1>
            <h2 className="text-lg font-bold text-gray-800 lg:hidden">Add Fields</h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleSaveForm}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                title="Save form"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleExportForm}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Export form"
              >
                <FileDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowImportDialog(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Import form"
              >
                <FileUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(!isPreviewMode)}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg hidden lg:block"
                title={isPreviewMode ? "Exit preview" : "Preview form"}
              >
                {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Field Types</h2>
          <div className="responsive-grid">
            {fieldTemplates.map((template) => (
              <button
                key={template.type}
                type="button"
                onClick={() => handleAddField(template)}
                className="p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
              >
                <div className="text-lg mb-1">{template.icon}</div>
                <div className="text-xs font-medium text-gray-700 group-hover:text-primary-700">
                  {template.label}
                </div>
              </button>
            ))}
          </div>

          {fields.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Form Fields</h2>
              <div className="text-xs text-gray-500 mb-2">
                {fields.length} field{fields.length !== 1 ? 's' : ''} added
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {!isPreviewMode ? (
          <>
            {/* Form Builder */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Build Your Form</h2>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Drag and drop fields from the sidebar to build your form. Click on fields to edit their properties.
                  </p>
                </div>

                {fields.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No fields added yet</p>
                    <p>Add fields from the sidebar to get started</p>
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(true)}
                      className="mt-4 btn-primary lg:hidden"
                    >
                      Add Fields
                    </button>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {fields.map((field) => (
                          <SortableFieldItem
                            key={field.id}
                            field={field}
                            isSelected={selectedField?.id === field.id}
                            onSelect={() => handleFieldSelect(field)}
                            onDelete={() => deleteField(field.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>

                    <DragOverlay>
                      {activeId ? (
                        <div className="form-field opacity-90">
                          <FormFieldComponent
                            field={fields.find(f => f.id === activeId)!}
                            value={''}
                            onChange={() => {}}
                            disabled
                          />
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                )}
              </div>
            </div>

            {/* Field Editor - Desktop only or mobile modal */}
            <div className="hidden lg:block lg:w-80 lg:border-l lg:border-gray-200">
              <FieldEditor
                field={selectedField}
                onUpdate={(updates) => {
                  if (selectedField) {
                    updateField(selectedField.id, updates);
                  }
                }}
                onDelete={() => {
                  if (selectedField) {
                    deleteField(selectedField.id);
                  }
                }}
              />
            </div>

            {/* Mobile Field Editor Modal */}
            {isFieldEditorOpen && selectedField && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
                <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Edit Field</h3>
                    <button
                      type="button"
                      onClick={() => setIsFieldEditorOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="h-full overflow-hidden">
                    <FieldEditor
                      field={selectedField}
                      onUpdate={(updates) => {
                        if (selectedField) {
                          updateField(selectedField.id, updates);
                        }
                      }}
                      onDelete={() => {
                        if (selectedField) {
                          deleteField(selectedField.id);
                        }
                        setIsFieldEditorOpen(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Preview Mode */
          <PreviewPanel
            fields={fields}
            formData={previewData}
            errors={previewErrors}
            onDataChange={updatePreviewData}
            onBack={() => setPreviewMode(false)}
          />
        )}
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Import Form Schema</h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="input-field w-full h-32 resize-none"
              placeholder="Paste your form schema JSON here..."
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowImportDialog(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportForm}
                className="btn-primary"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
