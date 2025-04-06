import React from 'react';
import {
  DndContext, closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Box } from '@mui/material';

function SortableQuestion({ question, index, handleDeleteQuestion, id }) {

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    handleDeleteQuestion(index);
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        ...style,
        padding: 16,
        marginBottom: 12,
        border: '1px solid #ddd',
        borderRadius: 8,
        backgroundColor: '#fafafa',
      }}
    >
      <h5>{question.question_text}</h5>
      <p>Type: {question.type}</p>
      {(question.type === 'single_choice' || question.type === 'multiple_choice') && (
        <p>Options: {question.options.join(', ')}</p>
      )}
      <Button onClick={handleDelete} color="error" variant="outlined">
        Delete
      </Button>
    </Box>
  );
}

export default function QuestionListDnd({ questions, setQuestions, handleDeleteQuestion }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      setQuestions((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),)

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
        {questions.map((question, index) => (
          <SortableQuestion
            key={question.id}
            id={question.id}
            index={index}
            question={question}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
