import './SqrManageRateAspectExtraJudge.scss';
import React from "react";
import {observer} from "mobx-react";
import {SqrManageRateAspectExtraProps} from "./SqrManageRateAspectExtra";
import SqrManageRateStore from "../SqrManageRate.store";
import DevsRadioButton from "@ajholl/devsuikit/dist/DevsRadioButton";

export interface SqrManageRateAspectExtraJudgeProps extends SqrManageRateAspectExtraProps {
}

export class SqrManageRateAspectExtraJudge extends React.Component<SqrManageRateAspectExtraJudgeProps> {
    sqrManageRateStore: SqrManageRateStore = this.props.rootStore.sqrManageRateStore;

    render() {
        const {criteria, subcriteria, aspect} = this.props;
        const zedAspect = this.sqrManageRateStore.zedAspects.find((zedAspect) => zedAspect.id === aspect.zedLink);
        return <>
            {zedAspect?.mark === '1' ? <div className="zed_aspect_message">Оценка аннулирована отсекающим
                аспектом <b>"{zedAspect.caption}"</b></div> : <></>}
            <div className="extra_judge">
                <div className="extra_judge__describe">
                    {aspect.extra?.slice()
                        .sort((ea, eb) => +(eb.order ?? '0') - +(ea.order ?? '0'))
                        .map((extra) => (
                            <div key={`${aspect.id}-${extra.id}-description-judge-score`}
                                 className="extra_judge__describe_item"
                            >
                                <div className="extra_judge__describe_item_score">
                                    {extra.order}
                                </div>
                                <div className="extra_judge__describe_item_description">
                                    {extra.description}
                                </div>
                            </div>
                        ))}
                </div>
                <div className="extra_judge__content">
                    {
                        [1, 2, 3, 4, 5].map((index) => (
                            <div key={`${aspect}-judge-score-${index}`}
                                 className="extra_judge__content_score"
                            >
                                <div className="extra_judge__content_score_index">
                                    {index}
                                </div>
                                {
                                    aspect.extra?.slice()
                                        .sort((ea, eb) => +(ea.order ?? '0') - +(eb.order ?? '0'))
                                        .map((extra) => (
                                            <div key={`${aspect.id}-${extra.id}-${index}`}
                                                 className="extra_judge__content_score_item"
                                            >
                                                <DevsRadioButton name={`${aspect.id}-${index}`}
                                                                 key={`${aspect.id}-${extra.id}-${index}-radio`}
                                                                 label={extra.order}
                                                                 labelSide="left"
                                                                 value={!!extra.mark?.includes(String(index))}
                                                                 disabled={zedAspect?.mark === '1'}
                                                                 onChange={(event) =>
                                                                     this.sqrManageRateStore.setAspectExtraJudgeMark(criteria.id, subcriteria.id, aspect.id, extra.id, index, event.target.checked)}
                                                />
                                            </div>
                                        ))
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </>;
    }
}

const OSqrManageRateAspectExtraJudge = observer(SqrManageRateAspectExtraJudge);
export default OSqrManageRateAspectExtraJudge;