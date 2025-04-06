import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Button, TextField } from '@mui/material';

const SortableOption = ({ option, index, handleDeleteOption, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '8px',
    background: '#f9f9f9',
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center', 
  };

  const handleDelete = () => {
    handleDeleteOption(index);
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <span>{option}</span>
      <Button
        onClick={handleDelete}
        color="error"
        variant="outlined"
        sx={{ marginLeft: '10px' }}
      >
        Delete Option
      </Button>
    </Box>
  );
};

const OptionListDnd = ({ options, setOptions }) => {
  const [inputValue, setInputValue] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleAddOption = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed]);
      setInputValue('');
    }
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = options.indexOf(active.id);
      const newIndex = options.indexOf(over.id);
      setOptions(arrayMove(options, oldIndex, newIndex));
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label="Add Option"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
        fullWidth
        sx={{ mb: 1 }}
      />
      <Button variant="outlined" onClick={handleAddOption} sx={{ mb: 2 }}>
        Add Option
      </Button>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={options} strategy={verticalListSortingStrategy}>
          {options.map((option, index) => (
            <SortableOption
              key={option + index}
              id={option}
              index={index}
              option={option}
              handleDeleteOption={handleDeleteOption}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};

export default OptionListDnd;
