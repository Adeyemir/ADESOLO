// Rate limiting middleware for API protection
import rateLimit from "express-rate-limit"

export const healthAnalysisLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: "Too many health analysis requests, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const reportGenerationLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 report generations per hour
  message: {
    error: "Too many report generation requests, please try again later.",
    retryAfter: "1 hour",
  },
})
