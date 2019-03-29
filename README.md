# Alexa: Name Analysis

This skill provides a short analysis for a given first name.

## Setup

This repository includes the [lamda function](/index.js) for retrieving the name analysis from kabalarians.com.

### Voice User Interface

1. The main intent, called AnalysisIntent, requires a slot for the first name and a slot for the gender.

1. The slot type for the name slot is AMAZON.US_FIRST_NAME, and since there is no slot type for gender, the slot type may be AMAZON.SearchQuery.

1. This intent may be invoked by saying a name.

### Screenshot of Intent Slots
![AnalysisIntent](/AnalysisIntent.png)

## Example Script

USER: Alexa, open Name Analysis

ALEXA: Welcome to Name Analysis. I can help you understand whether your first name is helping or hurting you… Please tell me your first name…

USER: James

ALEXA: Hi, James. What’s your gender?

USER: Male

ALEXA: As James, you have a natural interest in the welfare of your fellow man, and a desire to help and serve others in a humanitarian way. You are responsible and generous, although somewhat… 

Would you like to try another name?

USER: No

ALEXA: Thank you for trying Name Analysis. Remember your name can both help you and hurt you!
 
