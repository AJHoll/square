import './Help.view.scss';
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import React from "react";
import {observer} from "mobx-react";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'


interface HelpViewProps extends BaseViewProps {
}

interface HelpViewState {
    markdown: string;
}

export class HelpView extends React.Component<HelpViewProps, HelpViewState> {

    async componentDidMount(): Promise<void> {
        document.title = this.props.title;
        const helpData = await (await fetch('/assets/docs/index.md')).text();
        this.setState({markdown: helpData});
    }

    render() {
        return <div className="help_view">
            <Markdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
                      urlTransform={(url, key) => {
                          if (key === 'src') {
                              return url.replace('./', '/assets/docs/')
                          }
                          return url;
                      }}
            >
                {this.state?.markdown ?? ''}
            </Markdown>
        </div>
    }
}

const OHelpView = observer(HelpView);
export default OHelpView;