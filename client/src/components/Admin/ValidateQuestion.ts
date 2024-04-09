interface QuestionData {
    topic: string
    unit: string
    questionType: string
    content: string
    difficulty: string
    correctAnswers: string[]
    misleadingAnswers: string[]
}

export function ValidateQuestion(Data: QuestionData): string | null {
    if (!Data.topic || !Data.unit) {
        return "You must choose a unit and a topic!"

    } else if (!Data.questionType) {
        return "You must choose question type!"

    } else if (!Data.content || Data.content.length > 300 || Data.content.length < 10) {
        return "Question content must contain between 10 and 300 characters!"

    } else if (!Data.difficulty) {
        return "You must choose question difficulty!"

    } else if (!Data.correctAnswers.length) {
        return "You must specify at least one correct answer!"

    } else if (Data.questionType !== 'fill' && !Data.misleadingAnswers.length) {
        return "You must specify at least one misleading answer!"
        
    } else if ((Data.misleadingAnswers.includes("") && Data.questionType !== 'fill') || Data.correctAnswers.includes("")) {
        return "An answer option cannot be empty! Please enter a valid answer."

    } else if (Data.questionType !== 'order' && Data.misleadingAnswers.length + Data.correctAnswers.length > 7) { // total answer limits (correct+incorrect): 5 for pick and fill, 10 for order
        return "You can only have up to 7 answer options!"

    } else if (Data.questionType === 'order' && Data.misleadingAnswers.length + Data.correctAnswers.length > 15) {
        return "You can only have up to 15 answer options!"

    } else if (Data.questionType === 'fill' && !Data.content.includes("_")) {
        return "Question content must include a _ symbol that will symbolize the gap! Please make sure you include the symbol!"
    }

    return null
}
