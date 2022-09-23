const emailNotValid = async (forms, answers) => {
    const questions = forms.questions

    const found = questions.filter(question => {
        //just check if question type email
        if(question.type === "Email") {
            const answer = answers.find((answer) => answer.questionId == question.id)

            //required false, then answer.value can be empty
            if(question.required === false) {
                if(answer === undefined || answer.value === null || answer.value === undefined || answer.value === "") {
                    return false
                }
            }
            
            //check email format
            if(/.+@.+/.test(answer.value) === false) {
                return true
            }
        }
    })

    return found.length > 0 ? found[0].question : false
}

export default emailNotValid;