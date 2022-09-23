//check is answer.questionId duplicated
const answerDuplicated = async (answers) => {
    const newAnswer = answers.filter((answer, index, self) => self.findIndex(s => s.questionId === answer.questionId) === index)
    
    if(answers.length != newAnswer.length) {
        return true
    }
    return false
}

export default answerDuplicated;