import React, { useEffect, useMemo } from 'react'
import { useReduxDispatch } from '../redux'
import { get, update } from '../redux/surveys'
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react'
import 'survey-creator-core/survey-creator-core.css'
import { SurveyPanel } from 'survey-react-ui'
import { localization } from "survey-creator-core";

const Editor = (params: { id: string }): React.ReactElement => {
    const dispatch = useReduxDispatch()
    const creator = useMemo(() => {
        const options = {
            showLogicTab: true,
            showThemeTab: false,
            showTranslationTab: false,
            showDesignerTab: true,
            showTestSurveyTab: true,
            showJSONEditorTab: false,
            
            
        };
        return new SurveyCreator(options);
    }, []);
    creator.isAutoSave = true;
    creator.saveSurveyFunc = (saveNo: number, callback: (no: number, success: boolean) => void) => {
        dispatch(update({ id: params.id, json: creator.JSON, text: creator.text }))
        callback(saveNo, true);
    }
    const enLocale = localization.getLocale("en");
    enLocale.ed.addNewQuestion = "New Question";
    enLocale.ed.addNewTypeQuestion = "New {0}";

    
    useEffect(() => {
      
        
        (async () => {
            
            creator.toolbox.defineCategories([
                {
                    category: "Text Input",
                    items: [
                        "text",
                        "comment",
                        "number",
                        "text|email",
                        "text|date",
                        "dropdown",
                        "radiogroup",
                        "checkbox",
                        "file",
                        "signaturepad",
                        "rating"
                    ]
                }
            ], false);
            
            
            const surveyAction = await dispatch(get(params.id))
            if(typeof surveyAction.payload.json === 'object') {
                creator.JSON = surveyAction.payload.json
            } else {
                creator.text = surveyAction.payload.json
            }
        })()
    }, [dispatch, creator, params.id])

    return (<>
            <SurveyCreatorComponent creator={creator}/>
        </>)
}

export default Editor