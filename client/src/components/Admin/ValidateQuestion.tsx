interface QuestionData {
    topic: string
    unit: string
    questionType: string
    content: string
    difficulty: string
    correctAnswers: string[]
    misleadingAnswers: string[]
}

function Validate(Data: QuestionData): string | null {
    if (!Data.topic || !Data.unit) {
        return "You must choose a unit and a topic!"

    } else if (!Data.questionType) {
        return "You must choose question type!"

    } else if (!Data.content) {
        return "You must specify the question content!"

    } else if (!Data.difficulty) {
        return "You must choose question difficulty!"

    } else if (!Data.correctAnswers.length) {
        return "You must specify at least one correct answer!"

    } else if (!Data.misleadingAnswers.length) {
        return "You must specify at least one misleading answer!"
        
    } else if ((Data.misleadingAnswers.includes("") && Data.questionType !== 'fill') || Data.correctAnswers.includes("")) {
        return "An answer option cannot be empty!"

    } else if (Data.questionType !== 'order' && Data.misleadingAnswers.length + Data.correctAnswers.length > 5) { // answer limit = 5, 10 for type order
        return "You can only have up to five answer options!"

    } else if (Data.questionType === 'order' && Data.misleadingAnswers.length + Data.correctAnswers.length > 10) {
        return "You can only have up to ten answer options!"

    } else if (Data.questionType === 'fill' && !Data.content.includes("_")) {
        return "Question content must include a _ symbol that will symbolize the gap!"
    }

    return null
}
