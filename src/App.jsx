import React from 'react';
import useFormStore from './store/formStore';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormPreview from './components/FormPreview/FormPreview';
import './App.css';

function App() {
  const { isPreviewMode } = useFormStore();

  return (
    <div className="App container-responsive">
      {isPreviewMode ? <FormPreview /> : <FormBuilder />}
    </div>
  );
}

export default App;
