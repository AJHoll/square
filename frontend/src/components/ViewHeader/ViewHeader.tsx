import React from 'react';
import './ViewHeader.scss';
import { NavLink } from 'react-router-dom';

interface ViewHeaderProps {
  title: string;
}

export default class ViewHeader extends React.Component<ViewHeaderProps> {
  render() {
    return <div className="view_header">
      <NavLink to="/"
               className="view_header__backward_icon lni lni-home"
               title="Перейти на главную"
      />
      <span className="view_header__title">
        {this.props.title}
      </span>
    </div>;
  }
}