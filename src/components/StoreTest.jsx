import React from 'react';
import useFormStore from '../store/formStore';

const StoreTest = () => {
  const { fields, formTitle, addField, setFormTitle } = useFormStore();

  const handleTest = () => {
    console.log('Test button clicked');
    setFormTitle('Test Title');
    addField('text');
  };

  return (
    <div style={{ padding: '20px', border: '2px solid red', margin: '10px' }}>
      <h3>Store Test Component</h3>
      <p>Current title: {formTitle}</p>
      <p>Current fields count: {fields.length}</p>
      <button onClick={handleTest} style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
        Test Store
      </button>
      <div>
        <h4>Fields:</h4>
        {fields.map(field => (
          <div key={field.id}>{field.label} ({field.type})</div>
        ))}
      </div>
    </div>
  );
};

export default StoreTest;
