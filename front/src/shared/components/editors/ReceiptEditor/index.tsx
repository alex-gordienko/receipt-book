import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { AppContext } from '../../../../store';
import Modal from '../../Modal';
import {
  EditorContainer,
  EditorRow,
  EditorRowName,
  EditorRowValue,
  EditorRowLongValue,
  EditorRowSelect,
  EditorRowSelectContainer,
  EditorRowSelectOption
} from '../../../../styles/globalParams';

interface IReceiptEditorProps {
  open: boolean;
  selectedCategoryId: string;
  initialData?: receipts.IDBReceipt;
  onCreate: (newReceipt: receipts.IReceiptCreate) => void;
  onCancel: () => void;
}

const ReceiptEditor: React.FC<IReceiptEditorProps> = (props) => {
  const { state } = useContext(AppContext);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(props.selectedCategoryId);

  useEffect(() => {
    if (props.initialData) {
      setName(props.initialData.title);
      setDescription(props.initialData.description);
      setCategoryId(props.initialData.categoryId);
    }
  }, [props.initialData])

  const handleApplyChanges = () => {
    props.onCreate({
      title: name,
      description,
      categoryId
    })
  }

  return (
    <Modal show={props.open} type="editing" name={(props.initialData ? 'Edit' : 'Create') + ' receipt'} onOK={handleApplyChanges} onCancel={props.onCancel}>
      <EditorContainer>
        <EditorRow>
          <EditorRowName>Name</EditorRowName>
          <EditorRowValue value={name} onChange={(event) => setName(event.currentTarget.value)}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Description</EditorRowName>
          <EditorRowLongValue value={description} onChange={(event) => setDescription(event.currentTarget.value)}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Category</EditorRowName>
          <EditorRowSelectContainer>
            <EditorRowSelect value={categoryId} onChange={(event) => setCategoryId(event.currentTarget.value)}>
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

export default ReceiptEditor