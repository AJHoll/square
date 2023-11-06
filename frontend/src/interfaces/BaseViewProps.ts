import { RouteComponentProps } from 'react-router-dom';
import { StoreProps } from './StoreProps';
import { TitleProps } from './TitleProps';

export interface BaseViewProps extends RouteComponentProps, StoreProps, TitleProps {

}