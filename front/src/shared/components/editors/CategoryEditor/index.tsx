import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { AppContext } from '../../../../store';
import Modal from '../../Modal';
import {
  EditorContainer,
  EditorRow,
  EditorRowName,
  EditorRowValue,
  EditorRowSelect,
  EditorRowSelectContainer,
  EditorRowSelectOption
} from './styled';

interface ICategoryEditorProps {
  open: boolean;
  initialData?: categories.IDBCategory;
  onCreate: (newCategory: categories.ICategoryCreate) => void;
  onCancel: () => void;
}

const CategoryEditor: React.FC<ICategoryEditorProps> = (props) => {
  const { state } = useContext(AppContext);
  const [name, setName] = useState<string>('');
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    if (props.initialData) {
      setName(props.initialData.title);
      setParentId(props.initialData.parentId);
    }
  }, [props.initialData])

  const handleApplyChanges = () => {
    props.onCreate({
      title: name,
      parentId
    })
  }

  return (
    <Modal show={props.open} type="editing" name={(props.initialData ? 'Edit' : 'Create') + ' Category'} onOK={handleApplyChanges} onCancel={props.onCancel}>
      <EditorContainer>
        <EditorRow>
          <EditorRowName>Name</EditorRowName>
          <EditorRowValue value={name} onChange={(event) => setName(event.currentTarget.value)}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Parent</EditorRowName>
          <EditorRowSelectContainer>
            <EditorRowSelect value={parentId || undefined} onChange={(event) => setParentId(event.currentTarget.value)}>
              {state.categoriesList.map((category: categories.IDBCategory) => (
                <EditorRowSelectOption key={category._id} value={category._id}>{category.title}</EditorRowSelectOption>
              ))}
            </EditorRowSelect>
          </EditorRowSelectContainer>
        </EditorRow>
      </EditorContainer>
    </Modal>
  )
}

export default CategoryEditor