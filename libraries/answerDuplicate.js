//check is answer.questionId duplicated
const answerDuplicated = async (answers) => {
    var seen = new Set();
    return answers.some((answer) => {
        if(seen.has(answer.questionId)) {
            return true
        }
        seen.add(answer.questionId)
        return false
    })
}

export default answerDuplicated;