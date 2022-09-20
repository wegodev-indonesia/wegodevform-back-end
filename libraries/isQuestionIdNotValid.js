//check answer.questionId exist in questions id
const isQuestionIdNotValid = async (forms, answers) => {
    //find value empty
    const notValid = answers.filter((answer) => {
        let question = forms.questions.some((question) => question.id == answer.questionId)

        if(question === false) {
            return true
        }
    })

    return notValid.length > 0 ? true : false
}

export default isQuestionIdNotValid;