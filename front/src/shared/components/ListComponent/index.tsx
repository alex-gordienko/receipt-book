import { ButtonContainer, OKButton } from '../../../styles/globalParams';
import Pagination from '../Pagination';
import { ListComponentContainer, ListTitle, ListData, TopBlock } from './styled';

interface IListComponent<T> {
  isAdmin: boolean;
  title: string;
  page: number;
  pageSize: number;
  totalCount: number;
  data?: T[];
  renderAs: (elem: T, index: number) => JSX.Element;
  onCallNextPage: (newPage: number) => void;
  onCallCreateElement?: (title: string) => void;
}

const ListComponent = <TData, >(props: IListComponent<TData>) => {

  const renderData = () => {
    if (!props.data) {
      return <p>Loading...</p>
    }
    if (!props.data.length) {
      return <p>Oooopsie. There is no data to display</p>
    }
    return props.data.map(props.renderAs);
  }

  return (
    <ListComponentContainer>
      <TopBlock>
        <ListTitle>
          {props.title}. Page {props.page}/{Math.ceil(props.totalCount/props.pageSize)}
        </ListTitle>
        {props.isAdmin ? (
          <ButtonContainer>
            <OKButton onClick={() => !!props.onCallCreateElement && props.onCallCreateElement(props.title)}>Create</OKButton>
          </ButtonContainer>
        ) : null}
      </TopBlock>
      <ListData>
        {renderData()}
      </ListData>
      <Pagination currentPage={props.page} pageSize={props.pageSize} totalCount={props.totalCount} onPageSelect={props.onCallNextPage} />
    </ListComponentContainer>
  )
}

export default ListComponent