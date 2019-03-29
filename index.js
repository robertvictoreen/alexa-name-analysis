/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const cheerio = require('cheerio');
const request = require('request');

function getAnalysis(name, gender) {
    //Evaluate the source
    var source = 'https://www.kabalarians.com/name-meanings/names/' + gender + '/' + name + '.htm';
    //Use Promise to wait for data
    return new Promise((resolve, reject) => {
        request(source, (error, response, body) => {
            //Print the error if one occurred, message may be passed to Alexa to inform user
            console.log('error:', error);
            
            //Get the analysis from the HTML response body
            var analysis = cheerio.load(body)('#headerOL ul:first-of-type li:first-of-type').text();

            if (analysis.length == 0) {
                //Error message if analysis not found
                analysis = 'Sorry, ' + name + ', I couldn\'t find an analysis for your name';
            }

            resolve(analysis);
        });
    });
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to Name Analysis. ' +
            'I can help you understand whether your first name is helping or hurting you... ' +
            'Please tell me your first name...';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Please tell me your first name...')
            .getResponse();
    }
};
const AnalysisIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AnalysisIntent';
    },
    async handle(handlerInput) {
        
        var gender = handlerInput.requestEnvelope.request.intent.slots.Gender.value;
        var name = handlerInput.requestEnvelope.request.intent.slots.Name.value;
        
        var analysis = await getAnalysis(name, gender);
        
        return handlerInput.responseBuilder
            .speak(analysis + ' <break time="3s"/>Would you like to try another name?')
            .reprompt('Would you like to try another name?')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'I can help you understand whether your first name is helping or hurting you... ' +
            'Please tell me your first name...';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Thank you for trying Name Analysis. Remember your name can both help you and hurt you!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AnalysisIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
