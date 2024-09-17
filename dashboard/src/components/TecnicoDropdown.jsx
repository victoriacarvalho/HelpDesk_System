/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// TecnicoDropdown.js
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const TecnicoDropdown = ({ tecnicos, selectedTecnicoId, onChange }) => {
  return (
    <Select
      value={selectedTecnicoId}
      onChange={onChange}
      style={{ width: '100%' }}
      placeholder="Selecione um técnico"
    >
      {tecnicos.map((tecnico) => (
        <Option key={tecnico._id} value={tecnico._id}>
          {`${tecnico.firstName} ${tecnico.lastName}`}
        </Option>
      ))}
    </Select>
  );
};

export default TecnicoDropdown;
