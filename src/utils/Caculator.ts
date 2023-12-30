const CalculatorKhtn = (listScore: any[]) => {
  let score_avg = 0;
  for (const item of listScore) {
    score_avg += (item.evaluation_score * item.weight / 100)
  }
  return score_avg
}

const CalculatorSpkt = (listScore: any[]) => {
  let score_avg = 0;
  for (const score of listScore) {
    score_avg = score_avg + Number(score.evaluation_score) * (score?.evaluation_id?.weight / 100)
  }
  console.log("score_avg:" + score_avg)
  return (score_avg).toFixed(2)
}

const Caculator = { CalculatorKhtn, CalculatorSpkt }

export default Caculator