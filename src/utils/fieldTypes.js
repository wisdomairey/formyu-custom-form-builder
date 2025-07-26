export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  FILE: 'file',
  PHONE: 'phone',
  URL: 'url'
};

export const FIELD_TYPE_LABELS = {
  [FIELD_TYPES.TEXT]: 'Text Input',
  [FIELD_TYPES.EMAIL]: 'Email',
  [FIELD_TYPES.PASSWORD]: 'Password',
  [FIELD_TYPES.NUMBER]: 'Number',
  [FIELD_TYPES.TEXTAREA]: 'Text Area',
  [FIELD_TYPES.SELECT]: 'Dropdown',
  [FIELD_TYPES.RADIO]: 'Radio Buttons',
  [FIELD_TYPES.CHECKBOX]: 'Checkboxes',
  [FIELD_TYPES.DATE]: 'Date Picker',
  [FIELD_TYPES.FILE]: 'File Upload',
  [FIELD_TYPES.PHONE]: 'Phone Number',
  [FIELD_TYPES.URL]: 'URL'
};

export const CONDITIONAL_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  NOT_EMPTY: 'not_empty',
  EMPTY: 'empty'
};

export const CONDITIONAL_OPERATOR_LABELS = {
  [CONDITIONAL_OPERATORS.EQUALS]: 'equals',
  [CONDITIONAL_OPERATORS.NOT_EQUALS]: 'does not equal',
  [CONDITIONAL_OPERATORS.CONTAINS]: 'contains',
  [CONDITIONAL_OPERATORS.NOT_EMPTY]: 'is not empty',
  [CONDITIONAL_OPERATORS.EMPTY]: 'is empty'
};

export const getFieldIcon = (fieldType) => {
  const icons = {
    [FIELD_TYPES.TEXT]: '📝',
    [FIELD_TYPES.EMAIL]: '📧',
    [FIELD_TYPES.PASSWORD]: '🔒',
    [FIELD_TYPES.NUMBER]: '🔢',
    [FIELD_TYPES.TEXTAREA]: '📄',
    [FIELD_TYPES.SELECT]: '📋',
    [FIELD_TYPES.RADIO]: '⚪',
    [FIELD_TYPES.CHECKBOX]: '☑️',
    [FIELD_TYPES.DATE]: '📅',
    [FIELD_TYPES.FILE]: '📎',
    [FIELD_TYPES.PHONE]: '📞',
    [FIELD_TYPES.URL]: '🔗'
  };
  
  return icons[fieldType] || '❓';
};
