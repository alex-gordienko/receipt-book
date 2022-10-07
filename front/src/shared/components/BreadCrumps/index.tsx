import React, { useContext } from 'react';
import { AppContext } from '../../../store';
import { BreadCrump, BreadCrumpsContainer } from './styled';

interface IBreadCrumps {
  categoryId: string;
}

const BreadCrumps: React.FC<IBreadCrumps> = (props) => {
  const { state } = useContext(AppContext);

  const createBreadCrumpsData = (categoryId: string, categories: categories.IDBCategory[]): { isChainValid: boolean, breadCrumps: {name: string, id: string}[]} => {
    const chainList: string[] = [categoryId];
    const breadCrumps: { name: string, id: string }[] = [];
    let isChainValid = true;
    const categoryToCheck = categories.find((category: categories.IDBCategory) => categoryId === category._id);
    if (categoryToCheck && categoryToCheck.parentId) {
      chainList.push(categoryToCheck.parentId);
      while (true) {
        // eslint-disable-next-line no-loop-func
        const parent = categories.find((category: categories.IDBCategory) => category._id === chainList[chainList.length - 1]);
        if (!parent || !parent.parentId) {
          isChainValid = true;
          break;
        }
        if (chainList.includes(parent.parentId)) {
          console.log('Loop Detected!');
          isChainValid = false;
          break;
        }
        chainList.push(parent.parentId);
      }
      chainList.reverse();

      chainList.forEach((id: string)=> breadCrumps.push({id, name: categories.find((category: categories.IDBCategory) => id === category._id)!.title}))
    }
    return { isChainValid, breadCrumps }
  }

  return (
    <BreadCrumpsContainer>
      {createBreadCrumpsData(props.categoryId, state.categoriesList).breadCrumps.map(category => {
        const pathTo = `/categories/${category.id}?articlesPage=${state.pageArticles}&receiptsPage=${state.pageReceipts}`;
        return (
          <BreadCrump key={category.id} to={state.isAdmin ? '/admin' + pathTo : pathTo}>
            {category.name}
          </BreadCrump>
        )
      })}
    </BreadCrumpsContainer>
  )
}

export default BreadCrumps