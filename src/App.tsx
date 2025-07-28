import { useEffect } from 'react';
import FormBuilder from './components/FormBuilder';
import { useFormBuilderStore } from './store/formStore';
import './index.css';

function App() {
  const { createNewForm } = useFormBuilderStore();

  useEffect(() => {
    // Initialize with a new form on app start
    createNewForm('My Awesome Form');
  }, [createNewForm]);

  return (
    <div className="App">
      <FormBuilder />
    </div>
  );
}

export default App;
