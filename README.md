# Custom Form Builder

A powerful, feature-rich form builder built with React that solves the limitations of Google Forms by providing advanced conditional logic and live preview capabilities.

## 🚀 Features

### Core Functionality

- **Drag-and-Drop Interface**: Easy field addition from a comprehensive palette
- **Live Preview**: Real-time form preview with instant validation
- **Conditional Logic**: Advanced field visibility rules based on user responses
- **Form Validation**: Built-in validation with custom patterns and rules
- **Import/Export**: Save and load form configurations as JSON

### Field Types

- **Basic Fields**: Text, Email, Password, Number, Phone, URL
- **Advanced Inputs**: Textarea, Date Picker, File Upload
- **Choice Fields**: Dropdown, Radio Buttons, Checkboxes

### Advanced Features

- **Conditional Logic**: Show/hide fields based on other field values
- **Validation Rules**: Min/max length, required fields, custom regex patterns
- **Form Responses**: Real-time response handling for conditional logic
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0
- **State Management**: Zustand
- **Form Handling**: Formik + Yup
- **Styling**: Tailwind CSS 4.1.11
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: Heroicons
- **Build Tool**: Vite

## 📦 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd custom-form-builder
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🎯 Usage

### Building a Form

1. **Add Fields**: Click on field types in the left sidebar to add them to your form
2. **Configure Fields**: Select any field to edit its properties in the right sidebar

   - Set labels and placeholders
   - Configure validation rules
   - Set up conditional logic
   - Add options for choice fields

3. **Preview Form**: Click the "Preview" button to see how your form looks and test functionality
4. **Export/Import**: Save your form configuration or load existing ones

### Conditional Logic

Set up dynamic forms where fields appear or disappear based on user responses:

1. Select a field and enable "Conditional Logic" in the right sidebar
2. Choose which field should trigger the condition
3. Select the condition type (equals, contains, is empty, etc.)
4. Set the trigger value if needed

### Field Types and Validation

- **Text Fields**: Support min/max length and custom regex patterns
- **Email**: Built-in email format validation
- **Phone**: Phone number format validation
- **URL**: URL format validation
- **Number**: Numeric input validation
- **Required Fields**: Mark any field as required

## 🏗️ Project Structure

```
src/
├── components/
│   ├── FormBuilder/          # Form building interface
│   │   ├── FormBuilder.jsx   # Main builder layout
│   │   ├── FieldPalette.jsx  # Field type selector
│   │   ├── FieldList.jsx     # List of added fields
│   │   ├── FieldItem.jsx     # Individual field item
│   │   ├── FieldEditor.jsx   # Field configuration panel
│   │   └── FormHeader.jsx    # Header with actions
│   └── FormPreview/          # Form preview and testing
│       ├── FormPreview.jsx   # Main preview layout
│       └── PreviewField.jsx  # Individual field rendering
├── store/
│   └── formStore.js          # Zustand state management
├── utils/
│   ├── fieldTypes.js         # Field type definitions
│   └── validation.js         # Validation utilities
└── App.jsx                   # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📋 Form Configuration Format

Forms are exported/imported as JSON with this structure:

```json
{
  "title": "My Custom Form",
  "description": "Form description",
  "fields": [
    {
      "id": "unique-id",
      "type": "text",
      "label": "Field Label",
      "placeholder": "Enter text...",
      "required": true,
      "conditionalLogic": {
        "enabled": false,
        "showWhen": null,
        "condition": "equals",
        "value": ""
      },
      "validation": {
        "minLength": null,
        "maxLength": null,
        "pattern": null
      }
    }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## 🌟 Key Features Explained

### Conditional Logic Engine

The form builder includes a sophisticated conditional logic system that allows fields to show/hide based on:

- Exact value matches
- Text contains checks
- Empty/non-empty conditions
- Custom value comparisons

### Real-time Validation

Built with Formik and Yup for:

- Instant field validation
- Custom validation patterns
- User-friendly error messages
- Form submission handling

### State Management

Uses Zustand for efficient state management:

- Form configuration state
- Field selection state
- Preview mode toggle
- Form response tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React patterns and best practices
- Inspired by the need for more flexible form building tools
- Designed to be extensible and maintainable+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
