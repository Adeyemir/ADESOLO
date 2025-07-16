// Utility functions for health data processing
export class HealthAnalyzer {
  static calculateHealthScore(healthData) {
    let score = 0
    let maxScore = 0

    // Age factor (15 points)
    maxScore += 15
    if (healthData.age >= 18 && healthData.age <= 65) score += 15
    else if (healthData.age >= 13 && healthData.age <= 80) score += 12
    else score += 8

    // BMI factor (20 points)
    const heightM = healthData.heightCm / 100
    const bmi = healthData.weightKg / (heightM * heightM)
    maxScore += 20
    if (bmi >= 18.5 && bmi <= 24.9) score += 20
    else if (bmi >= 17 && bmi <= 29.9) score += 15
    else score += 10

    // Heart rate factor (15 points)
    maxScore += 15
    if (healthData.restingHeartRate >= 60 && healthData.restingHeartRate <= 100) score += 15
    else if (healthData.restingHeartRate >= 50 && healthData.restingHeartRate <= 110) score += 12
    else score += 8

    // Blood pressure factor (15 points)
    maxScore += 15
    if (healthData.systolicBP < 120) score += 15
    else if (healthData.systolicBP < 140) score += 12
    else score += 8

    // Physical activity factor (15 points)
    maxScore += 15
    const activityScores = {
      "extremely-active": 15,
      "very-active": 15,
      "moderately-active": 13,
      "lightly-active": 10,
      sedentary: 5,
    }
    score += activityScores[healthData.physicalActivity] || 8

    // Smoking factor (10 points)
    maxScore += 10
    const smokingScores = {
      never: 10,
      former: 8,
      occasional: 5,
      regular: 3,
      heavy: 1,
    }
    score += smokingScores[healthData.smokingHabits] || 5

    // Existing conditions factor (10 points)
    maxScore += 10
    if (healthData.existingConditions === "none") score += 10
    else if (["diabetes", "hypertension"].includes(healthData.existingConditions)) score += 6
    else score += 4

    return Math.round((score / maxScore) * 100)
  }

  static determineRiskLevel(healthScore, healthData) {
    // Base risk on health score
    let riskLevel = "low"
    if (healthScore < 60) riskLevel = "high"
    else if (healthScore < 80) riskLevel = "moderate"

    // Adjust for specific risk factors
    if (healthData.existingConditions !== "none") {
      if (riskLevel === "low") riskLevel = "moderate"
      else if (riskLevel === "moderate") riskLevel = "high"
    }

    if (healthData.familyHistory && healthData.familyHistory.toLowerCase().includes("diabetes")) {
      if (riskLevel === "low") riskLevel = "moderate"
    }

    return riskLevel
  }

  static generateInsights(healthData, healthScore, riskLevel) {
    const insights = []

    // BMI insights
    const heightM = healthData.heightCm / 100
    const bmi = healthData.weightKg / (heightM * heightM)

    if (bmi < 18.5) insights.push("Your BMI indicates you may be underweight. Consider consulting a nutritionist.")
    else if (bmi > 25) insights.push("Your BMI suggests you may benefit from weight management strategies.")

    // Activity insights
    if (healthData.physicalActivity === "sedentary") {
      insights.push("Increasing physical activity could significantly improve your health score.")
    }

    // Blood pressure insights
    if (healthData.systolicBP > 140) {
      insights.push("Your blood pressure reading suggests monitoring and potential medical consultation.")
    }

    return insights
  }
}
