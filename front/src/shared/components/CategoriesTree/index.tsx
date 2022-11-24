import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../store";
import { setServerError, saveCategoryList } from "../../../store/actions";
import { ButtonContainer, OKButton } from "../../../styles/globalParams";
import { createCategory, isRequestError } from "../../helpers/httpConnector";
import CategoryEditor from '../editors/CategoryEditor';
import {
  CategoryTopBlock,
  CategoriesTreeContainer,
  CategoriesTreeBlock,
  CategoriesTreeContent,
  Category,
  CategoryLabel,
  CategoryTitle
} from './styled';

const CategoriesTree: React.FC<{}> = () => {
  const { state, dispatch } = useContext(AppContext);
  const [openCategoryEditor, setOpenCategoryEditor] = useState(false);
  const navigate = useNavigate();

  const createTree = (array: categories.IDBCategory[]): categories.ICategoryTree[] => {
    const arrayWithChilds: categories.ICategoryTree[] = array.map((value: categories.IDBCategory) => ({ ...value, childs: [] }));
    return arrayWithChilds.filter((elem) => {
      if (elem.parentId) {
        const parent = arrayWithChilds.find((search) => elem.parentId === search._id);
        if (!parent) {
          return true
        }
        parent.childs.push(elem);
        return false
      }
      else return true
    });
  };

  const renderCategory = (category: categories.ICategoryTree, level: number) => {
    level++;
    const pathTo = `/categories/${category._id}?articlesPage=1&receiptsPage=1`;
    return (
      <Category level={level}>
        <CategoryLabel to={state.isAdmin? '/admin' + pathTo : pathTo}>{category.title}</CategoryLabel>
        <>{category.childs.map((child: categories.ICategoryTree) => renderCategory(child, level))}</>
      </Category>
    )
  }

  const onCreateCategory = async (newArticle: categories.ICategoryCreate) => {
    try {
      const createdCategory = await createCategory(newArticle);
      setOpenCategoryEditor(false);
      saveCategoryList(dispatch, [...state.categoriesList, createdCategory]);
      const pathTo = `/categories/${createdCategory._id}?articlesPage=1&receiptsPage=1`;
      navigate(state.isAdmin ? '/admin' + pathTo : pathTo);
    } catch (error) {
      setServerError(dispatch, { errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
    }
  }

  return (
    <CategoriesTreeContainer>
      <CategoryEditor open={openCategoryEditor} onCancel={() => setOpenCategoryEditor(false)} onCreate={onCreateCategory} />
      <CategoriesTreeBlock>
        <CategoryTopBlock>
          <CategoryTitle>
            Categories
          </CategoryTitle>
          <ButtonContainer>
            {state.isAdmin ? (
              <ButtonContainer>
                <OKButton onClick={() => setOpenCategoryEditor(true)}>Create</OKButton>
              </ButtonContainer>
            ) : null}
          </ButtonContainer>
        </CategoryTopBlock>
        <CategoriesTreeContent>
          {createTree(state.categoriesList).map((data: categories.ICategoryTree) => renderCategory(data, 0))}
        </CategoriesTreeContent>
      </CategoriesTreeBlock>
    </CategoriesTreeContainer>
  )
}

export default CategoriesTree