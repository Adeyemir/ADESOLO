// API Route: /api/analyze-health
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const healthData = req.body

    // Validate required fields
    const requiredFields = ["age", "weightKg", "heightCm", "restingHeartRate", "systolicBP"]
    for (const field of requiredFields) {
      if (!healthData[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` })
      }
    }

    // Calculate BMI
    const heightM = healthData.heightCm / 100
    const bmi = (healthData.weightKg / (heightM * heightM)).toFixed(1)

    // Generate comprehensive health analysis
    const analysis = await generateHealthAnalysis(healthData, bmi)

    // Generate personalized recommendations
    const recommendations = await generateRecommendations(healthData, bmi, analysis)

    // Generate meal plan
    const mealPlan = await generateMealPlan(healthData, analysis)

    res.status(200).json({
      success: true,
      data: {
        healthScore: analysis.healthScore,
        riskLevel: analysis.riskLevel,
        analysis: analysis.summary,
        recommendations: recommendations,
        mealPlan: mealPlan,
        bmi: Number.parseFloat(bmi),
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Health analysis error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to analyze health data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

async function generateHealthAnalysis(healthData, bmi) {
  const prompt = `
As a health analytics AI, analyze this comprehensive health assessment:

PERSONAL INFO:
- Age: ${healthData.age}
- Weight: ${healthData.weightKg}kg
- Height: ${healthData.heightCm}cm
- BMI: ${bmi}

HEALTH METRICS:
- Resting Heart Rate: ${healthData.restingHeartRate} BPM
- Systolic Blood Pressure: ${healthData.systolicBP} mmHg

LIFESTYLE FACTORS:
- Physical Activity: ${healthData.physicalActivity}
- General Lifestyle: ${healthData.generalLifestyle}
- Dietary Habits: ${healthData.dietaryHabits}
- Smoking Status: ${healthData.smokingHabits}
- Existing Conditions: ${healthData.existingConditions}
- Family History: ${healthData.familyHistory}

Please provide:
1. Overall health score (0-100)
2. Risk level (low/moderate/high)
3. Key health insights and areas of concern
4. Positive aspects to maintain

Format as JSON with: healthScore, riskLevel, summary, keyInsights, positiveAspects
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 1000,
  })

  return JSON.parse(completion.choices[0].message.content)
}

async function generateRecommendations(healthData, bmi, analysis) {
  const prompt = `
Based on this health analysis, generate personalized lifestyle recommendations:

HEALTH DATA: ${JSON.stringify(healthData)}
BMI: ${bmi}
ANALYSIS: ${JSON.stringify(analysis)}

Generate specific, actionable recommendations in these categories:
1. Exercise & Physical Activity (3-4 specific recommendations)
2. Nutrition & Diet (3-4 specific recommendations)  
3. Lifestyle Changes (2-3 specific recommendations)
4. Health Monitoring (2-3 specific recommendations)
5. Risk Management (if applicable)

Each recommendation should be:
- Specific and actionable
- Tailored to their current fitness level and conditions
- Include frequency/duration where relevant
- Consider their existing habits and constraints

Format as JSON with categories as keys and arrays of recommendation objects with: title, description, priority (high/medium/low), timeframe
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 1500,
  })

  return JSON.parse(completion.choices[0].message.content)
}

async function generateMealPlan(healthData, analysis) {
  const prompt = `
Create a personalized 7-day meal plan based on:

HEALTH DATA: ${JSON.stringify(healthData)}
ANALYSIS: ${JSON.stringify(analysis)}

Consider:
- Dietary preferences: ${healthData.dietaryHabits}
- Health conditions: ${healthData.existingConditions}
- Activity level: ${healthData.physicalActivity}
- Family history: ${healthData.familyHistory}

Generate a balanced meal plan with:
- Breakfast, lunch, dinner, and 2 snacks per day
- Nutritional focus areas based on their health profile
- Portion guidance
- Preparation difficulty (easy/medium/hard)
- Estimated calories per meal

Format as JSON with days array, each containing meals object with breakfast, lunch, dinner, snacks arrays. Each meal should have: name, ingredients, calories, prepTime, difficulty, nutritionalFocus
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 2000,
  })

  return JSON.parse(completion.choices[0].message.content)
}
