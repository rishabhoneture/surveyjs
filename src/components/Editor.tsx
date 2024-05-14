import React, { useEffect, useMemo } from 'react'
import { useReduxDispatch } from '../redux'
import { get, update } from '../redux/surveys'
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react'
import 'survey-creator-core/survey-creator-core.css'
import { SurveyPanel } from 'survey-react-ui'
import { localization, PagesController } from "survey-creator-core";
import { Serializer, settings } from "survey-core";

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
            showSurveyTitle:true,
        

            
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
// // Add a property to the Survey class
Serializer.addProperty("survey", {
    name: "customSurveyProperty",
    category: "general",
    visibleIndex: 0
});

// Add a property to the Page class
Serializer.addProperty("page", {
    name: "customPageProperty",
    category: "general2",
    visibleIndex: 1
});

// Register an event handler for showing properties
creator.onShowingProperty.add(function(sender, options) {
    // Check if the type of the object whose property is being shown is "survey"
    if (options.obj.getType() == "survey") {
        if (options.property.name == "title") {
            // Allow showing the "title" property and change its editor type to text
            options.canShow = true;
            options.property.editorType = "text";
            options.property.displayName = "Abhish Title"; // Change display name
        } else if (options.property.name == "description") {
            // Allow showing the "description" property and change its editor type to textarea
            options.canShow = true;
            options.property.editorType = "textarea";
        } else if (options.property.name == "customSurveyProperty") {
            // Add custom logic for the "customSurveyProperty"
            options.canShow = true;
            options.property.editorType = "text";
            options.property.displayName = "Custom Survey Property"; // Change display name
        } else {
            // Hide all other properties for the survey element
            options.canShow = false;
        }
    } else if (options.obj.getType() == "page") {
        // Similar logic for handling properties of type "page"
        if (options.property.name == "customPageProperty") {
            options.canShow = true;
            options.property.editorType = "text";
            options.property.displayName = "Custom Page Property";
        } else {
            options.canShow = false;
        }
    }
});


    creator.JSON = {};

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