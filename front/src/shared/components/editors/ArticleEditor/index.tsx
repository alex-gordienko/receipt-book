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
} from './styled';

interface IArticleEditorProps {
  open: boolean;
  selectedCategoryId: string;
  initialData?: articles.IDBArticles;
  onCreate: (newArticle: articles.IArticleCreate) => void;
  onCancel: () => void;
}

const ArticleEditor: React.FC<IArticleEditorProps> = (props) => {
  const { state } = useContext(AppContext);
  const [name, setName] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(props.selectedCategoryId);

  useEffect(() => {
    if (props.initialData) {
      setName(props.initialData.title);
      setShortDescription(props.initialData.shortDescription);
      setLongDescription(props.initialData.longDescription);
      setCategoryId(props.initialData.categoryId);
    }
  }, [props.initialData])

  const handleApplyChanges = () => {
    props.onCreate({
      title: name,
      shortDescription,
      longDescription,
      categoryId
    })
  }

  return (
    <Modal show={props.open} type="editing" name={(props.initialData ? 'Edit' : 'Create') + ' Article'} onOK={handleApplyChanges} onCancel={props.onCancel}>
      <EditorContainer>
        <EditorRow>
          <EditorRowName>Name</EditorRowName>
          <EditorRowValue value={name} onChange={(event) => setName(event.currentTarget.value)}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Short Discription</EditorRowName>
          <EditorRowValue value={shortDescription} onChange={(event) => setShortDescription(event.currentTarget.value)}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Long Description</EditorRowName>
          <EditorRowLongValue value={longDescription} onChange={(event) => setLongDescription(event.currentTarget.value)}/>
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

export default ArticleEditor