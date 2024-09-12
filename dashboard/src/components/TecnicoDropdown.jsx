/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const TecnicoDropdown = ({ tecnicos, selectedTecnico, onChange }) => {
  return (
    <Select
      value={selectedTecnico}
      onChange={onChange}
      style={{ width: '100%' }}
      placeholder="Selecione um técnico"
    >
      {tecnicos.length > 0 ? (
        tecnicos.map(tecnico => (
          <Option key={tecnico._id} value={tecnico._id}>
            {`${tecnico.firstName} ${tecnico.lastName}`}
          </Option>
        ))
      ) : (
        <Option disabled>Carregando técnicos...</Option>
      )}
    </Select>
  );
};

export default TecnicoDropdown;
