// API Route: /api/generate-report
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { healthData, analysis, recommendations, mealPlan } = req.body

    const report = await generateDetailedReport(healthData, analysis, recommendations, mealPlan)

    res.status(200).json({
      success: true,
      report: report,
    })
  } catch (error) {
    console.error("Report generation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
    })
  }
}

async function generateDetailedReport(healthData, analysis, recommendations, mealPlan) {
  const prompt = `
Generate a comprehensive health assessment report in markdown format:

HEALTH DATA: ${JSON.stringify(healthData)}
ANALYSIS: ${JSON.stringify(analysis)}
RECOMMENDATIONS: ${JSON.stringify(recommendations)}
MEAL PLAN: Available

Create a professional health report with:

1. Executive Summary
2. Health Assessment Results
3. Risk Analysis
4. Personalized Recommendations
5. Meal Planning Guide
6. Progress Tracking Suggestions
7. Next Steps

Make it professional, encouraging, and actionable. Include specific metrics and timelines.
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 2500,
  })

  return completion.choices[0].message.content
}
