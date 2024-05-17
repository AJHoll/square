import './DevsInputWrapper.scss';
import React from "react";
import {InputProps} from "@ajholl/devsuikit";
import {InputText} from "primereact/inputtext";

interface DevsInputWrapperProps extends InputProps {
}

export class DevsInputWrapper extends React.Component<DevsInputWrapperProps> {
    render() {
        const {
            keyFilter,
            placeholder,
            className,
            invalid,
            value
        } = this.props;
        return <div
            className={`p-inputgroup devs_input devs_input__disabled ${className !== undefined ? className : ''} ${invalid ? 'devs_input__invalid' : ''}`}
        >
            <InputText keyfilter={keyFilter}
                       placeholder={placeholder}
                       disabled={true}
                       className={invalid ? 'p-invalid' : ''}
                       value={value}
            />
        </div>;
    }
}