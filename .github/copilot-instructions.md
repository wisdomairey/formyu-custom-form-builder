<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Custom Form Builder Project Instructions

This is a React TypeScript project for building a drag-and-drop form builder with conditional logic.

## Tech Stack

- React 19 with TypeScript
- Zustand for state management
- Formik + Yup for form validation
- Tailwind CSS for styling
- @dnd-kit for drag and drop functionality
- Lucide React for icons
- Vite for build tooling

## Architecture Guidelines

### Components Structure

- Use functional components with hooks
- Separate business logic from UI components
- Follow the component hierarchy: FormBuilder > FieldEditor, PreviewPanel > FormField
- Use proper TypeScript interfaces for all props and state

### State Management

- Use Zustand for global form builder state
- Keep form field definitions, conditions, and preview state separate
- Implement undo/redo functionality where appropriate

### Form Fields

- Support: text, textarea, select, radio, checkbox, number, email, date
- Each field should have: id, type, label, placeholder, required, validation rules
- Conditional logic should support: show/hide based on other field values

### Styling

- Use Tailwind CSS classes consistently
- Follow the design system with primary colors and consistent spacing
- Ensure responsive design for different screen sizes
- Use semantic HTML and proper accessibility attributes

### Code Quality

- Write descriptive variable and function names
- Add inline comments for complex logic
- Use proper error boundaries and error handling
- Implement proper TypeScript types for all data structures
