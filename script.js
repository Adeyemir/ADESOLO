// Updated global variables to match original form
let currentUser = {
  // Personal Information
  fullName: "John Doe",
  dateOfBirth: "",
  age: 30,
  weightKg: 75,
  heightCm: 175,

  // Health Metrics
  restingHeartRate: 72,
  systolicBP: 120,

  // Lifestyle Assessment
  physicalActivity: "moderately-active",
  generalLifestyle: "moderate",
  dietaryHabits: "balanced",
  smokingHabits: "never",
  existingConditions: "none",
  familyHistory: "",

  // Calculated values (can be updated by AI)
  bmi: 0,
  healthScore: 85,
  riskLevel: "low",
  medications: [
    { name: "Vitamin D", time: "8:00 AM", taken: true },
    { name: "Omega-3", time: "12:00 PM", taken: false },
  ],
  // New AI-related data
  aiAnalysis: null,
  recommendations: null,
  mealPlan: null,
  lastAnalysis: null,
  completedRecommendations: [], // New array to track completed recommendations
}

// DOM elements
const navbar = document.getElementById("navbar")
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const modalOverlay = document.getElementById("modal-overlay")
const mealPlanModalOverlay = document.getElementById("meal-plan-modal-overlay") // New
const contactForm = document.getElementById("contact-form")
const vitalsForm = document.getElementById("vitals-form")
const aiDashboardSection = document.getElementById("ai-dashboard") // New

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeScrollEffects()
  initializeForms()
  updateDashboard()
  initializeAnimations()
  loadFromLocalStorage() // Load user data including AI insights on startup
})

// Navigation functionality
function initializeNavigation() {
  // Mobile menu toggle
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    navToggle.classList.toggle("active")
  })

  // Close mobile menu when clicking on links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")

      // Update active link
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
    }
  })
}

// Scroll effects
function initializeScrollEffects() {
  window.addEventListener("scroll", () => {
    // Navbar scroll effect
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Update active navigation link based on scroll position
    updateActiveNavLink()
  })
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

// Smooth scrolling
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

// Form handling
function initializeForms() {
  // Contact form
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // Vitals form
  if (vitalsForm) {
    vitalsForm.addEventListener("submit", handleVitalsForm) // Fallback to basic submission
    // We will bind the AI-enhanced function to the button directly
    document.querySelector(".btn-analyze").onclick = saveVitals // Ensures AI analysis is used
  }
}

function handleContactForm(e) {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  }

  // Show loading state
  const submitBtn = contactForm.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Sending..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    showNotification("Message sent successfully!", "success")
    contactForm.reset()
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 2000)
}

// Enhanced form validation for comprehensive assessment
function validateHealthAssessment(formData) {
  const errors = {}

  // Personal Information validation
  const fullName = formData.get("fullName")
  if (!fullName || fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name"
  }

  const age = formData.get("age")
  if (!age || age < 1 || age > 120) {
    errors.age = "Please enter a valid age between 1-120"
  }

  const weightKg = formData.get("weightKg")
  if (!weightKg || weightKg < 20 || weightKg > 300) {
    errors.weightKg = "Please enter a valid weight between 20-300 kg"
  }

  const heightCm = formData.get("heightCm")
  if (!heightCm || heightCm < 100 || heightCm > 250) {
    errors.heightCm = "Please enter a valid height between 100-250 cm"
  }

  // Health Metrics validation
  const restingHeartRate = formData.get("restingHeartRate")
  if (!restingHeartRate || restingHeartRate < 40 || restingHeartRate > 200) {
    errors.restingHeartRate = "Please enter a valid heart rate between 40-200 BPM"
  }

  const systolicBP = formData.get("systolicBP")
  if (!systolicBP || systolicBP < 70 || systolicBP > 200) {
    errors.systolicBP = "Please enter a valid systolic BP between 70-200 mmHg"
  }

  // Lifestyle Assessment validation
  if (!formData.get("physicalActivity")) {
    errors.physicalActivity = "Please select your physical activity level"
  }

  if (!formData.get("generalLifestyle")) {
    errors.generalLifestyle = "Please select your general lifestyle pattern"
  }

  if (!formData.get("dietaryHabits")) {
    errors.dietaryHabits = "Please select your dietary habits"
  }

  if (!formData.get("smokingHabits")) {
    errors.smokingHabits = "Please select your smoking status"
  }

  if (!formData.get("existingConditions")) {
    errors.existingConditions = "Please select existing health conditions"
  }

  return errors
}

// Enhanced form submission handler (non-AI fallback)
function handleVitalsForm(e) {
  e.preventDefault()

  const formData = new FormData(vitalsForm)

  // Validate comprehensive assessment
  const errors = validateHealthAssessment(formData)

  // Clear previous errors
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("has-error")
    const errorElement = group.querySelector(".error-message")
    if (errorElement) errorElement.remove()
  })

  // Display errors if any
  if (Object.keys(errors).length > 0) {
    Object.keys(errors).forEach((field) => {
      const input = document.querySelector(`#${field.replace(/([A-Z])/g, "-$1").toLowerCase()}`)
      if (input) {
        const formGroup = input.closest(".form-group")
        formGroup.classList.add("has-error")

        const errorElement = document.createElement("div")
        errorElement.className = "error-message"
        errorElement.textContent = errors[field]
        formGroup.appendChild(errorElement)
      }
    })
    showNotification("Please correct the errors in the form", "error")
    return
  }

  // Update current user data (basic calculation only)
  currentUser.fullName = formData.get("fullName")
  currentUser.dateOfBirth = formData.get("dateOfBirth")
  currentUser.age = Number.parseInt(formData.get("age"))
  currentUser.weightKg = Number.parseFloat(formData.get("weightKg"))
  currentUser.heightCm = Number.parseInt(formData.get("heightCm"))
  currentUser.restingHeartRate = Number.parseInt(formData.get("restingHeartRate"))
  currentUser.systolicBP = Number.parseInt(formData.get("systolicBP"))
  currentUser.physicalActivity = formData.get("physicalActivity")
  currentUser.generalLifestyle = formData.get("generalLifestyle")
  currentUser.dietaryHabits = formData.get("dietaryHabits")
  currentUser.smokingHabits = formData.get("smokingHabits")
  currentUser.existingConditions = formData.get("existingConditions")
  currentUser.familyHistory = formData.get("familyHistory")

  // Calculate BMI
  const heightM = currentUser.heightCm / 100
  currentUser.bmi = (currentUser.weightKg / (heightM * heightM)).toFixed(1)

  // Calculate comprehensive health score (non-AI)
  calculateComprehensiveHealthScore()

  // Clear previous AI results if non-AI path is taken
  currentUser.aiAnalysis = null
  currentUser.recommendations = null
  currentUser.mealPlan = null
  currentUser.lastAnalysis = null
  currentUser.completedRecommendations = []

  // Update dashboard and close modal
  updateDashboard()
  closeModal()
  showNotification("Health assessment completed successfully!", "success")
  saveUserData() // Save updated non-AI user data
}

// Enhanced form submission with AI analysis
async function handleVitalsFormWithAI(e) {
  e.preventDefault()

  const formData = new FormData(vitalsForm)
  const errors = validateHealthAssessment(formData)

  // Clear previous errors
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("has-error")
    const errorElement = group.querySelector(".error-message")
    if (errorElement) errorElement.remove()
  })

  if (Object.keys(errors).length > 0) {
    Object.keys(errors).forEach((field) => {
      const input = document.querySelector(`#${field.replace(/([A-Z])/g, "-$1").toLowerCase()}`)
      if (input) {
        const formGroup = input.closest(".form-group")
        formGroup.classList.add("has-error")
        const errorElement = document.createElement("div")
        errorElement.className = "error-message"
        errorElement.textContent = errors[field]
        formGroup.appendChild(errorElement)
      }
    })
    showNotification("Please correct the errors in the form", "error")
    return
  }

  // Show loading state
  const analyzeBtn = document.querySelector(".btn-analyze")
  const originalText = analyzeBtn.textContent
  analyzeBtn.textContent = "🔄 Analyzing..."
  analyzeBtn.disabled = true

  try {
    // Prepare health data for AI analysis
    const healthData = {
      fullName: formData.get("fullName"),
      dateOfBirth: formData.get("dateOfBirth"),
      age: Number.parseInt(formData.get("age")),
      weightKg: Number.parseFloat(formData.get("weightKg")),
      heightCm: Number.parseInt(formData.get("heightCm")),
      restingHeartRate: Number.parseInt(formData.get("restingHeartRate")),
      systolicBP: Number.parseInt(formData.get("systolicBP")),
      physicalActivity: formData.get("physicalActivity"),
      generalLifestyle: formData.get("generalLifestyle"),
      dietaryHabits: formData.get("dietaryHabits"),
      smokingHabits: formData.get("smokingHabits"),
      existingConditions: formData.get("existingConditions"),
      familyHistory: formData.get("familyHistory"),
    }

    // Send to AI analysis endpoint
    const response = await fetch("/api/analyze-health", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(healthData),
    })

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`)
    }

    const analysisResult = await response.json()

    if (analysisResult.success) {
      // Update current user with AI results
      currentUser = { ...currentUser, ...healthData }
      currentUser.bmi = analysisResult.data.bmi
      currentUser.healthScore = analysisResult.data.healthScore
      currentUser.riskLevel = analysisResult.data.riskLevel
      currentUser.aiAnalysis = analysisResult.data.analysis
      currentUser.recommendations = analysisResult.data.recommendations
      currentUser.mealPlan = analysisResult.data.mealPlan
      currentUser.lastAnalysis = analysisResult.data.timestamp
      currentUser.completedRecommendations = [] // Reset completed recommendations on new analysis

      // Update dashboard and close modal
      updateDashboard() // Update general dashboard vitals
      displayAIDashboard() // Populate the new AI dashboard section
      closeModal()
      showNotification("AI health analysis completed successfully!", "success")
      saveUserData()
      scrollToSection("ai-dashboard") // Scroll to AI dashboard after analysis
    } else {
      throw new Error(analysisResult.message || "Analysis failed")
    }
  } catch (error) {
    console.error("AI Analysis error:", error)
    showNotification(`Analysis failed: ${error.message}`, "error")

    // Fallback to basic calculation if AI fails
    handleVitalsForm(e)
  } finally {
    // Restore button state
    analyzeBtn.textContent = originalText
    analyzeBtn.disabled = false
  }
}

// Display AI analysis results (now populating the dedicated section)
function displayAIDashboard() {
  if (!currentUser.aiAnalysis || !aiDashboardSection) {
    aiDashboardSection.classList.add("hidden")
    return
  }

  aiDashboardSection.classList.remove("hidden")

  // Update AI Analysis Summary Card
  document.getElementById("ai-health-score").textContent = currentUser.healthScore
  const riskBadge = document.getElementById("ai-risk-badge")
  riskBadge.textContent = `${currentUser.riskLevel.toUpperCase()} RISK`
  riskBadge.className = `risk-badge risk-${currentUser.riskLevel}`
  document.getElementById("ai-analysis-text").textContent = currentUser.aiAnalysis
  document.getElementById("ai-last-analysis").textContent =
    `Last updated: ${formatDate(new Date(currentUser.lastAnalysis))} at ${formatTime(new Date(currentUser.lastAnalysis))}`

  // Update Progress Stats/Charts
  updateCharts()

  // Update Lifestyle Recommendations
  updateRecommendationsList()

  // Update Meal Plan Preview
  const mealPlanSummaryElement = document.getElementById("meal-plan-summary")
  if (currentUser.mealPlan) {
    mealPlanSummaryElement.textContent = "A 7-day personalized meal plan has been generated for you."
    document.querySelector(".meal-plan-card .btn-primary").style.display = "inline-flex" // Show button
  } else {
    mealPlanSummaryElement.textContent = "No meal plan available. Complete a health assessment."
    document.querySelector(".meal-plan-card .btn-primary").style.display = "none" // Hide button
  }
}

function updateCharts() {
  // BMI Chart
  const bmiBar = document.getElementById("bmi-bar")
  const bmiLabel = document.getElementById("bmi-label")
  const currentBMI = currentUser.bmi || 0
  const bmiPercentage = Math.min(100, Math.max(0, (currentBMI / 40) * 100)) // Assuming max BMI for chart is 40

  bmiBar.style.width = `${bmiPercentage}%`
  bmiLabel.textContent = `${currentBMI} BMI`

  if (currentBMI >= 18.5 && currentBMI <= 24.9) {
    bmiBar.style.backgroundColor = "var(--success-color)"
    bmiBar.title = "Healthy BMI"
  } else if (currentBMI < 18.5) {
    bmiBar.style.backgroundColor = "var(--warning-color)"
    bmiBar.title = "Underweight"
  } else {
    bmiBar.style.backgroundColor = "var(--error-color)"
    bmiBar.title = "Overweight/Obese"
  }

  // Health Score Chart
  const healthScoreBar = document.getElementById("health-score-bar")
  const healthScoreLabel = document.getElementById("health-score-label")
  const currentHealthScore = currentUser.healthScore || 0

  healthScoreBar.style.width = `${currentHealthScore}%`
  healthScoreLabel.textContent = `${currentHealthScore} Score`

  if (currentHealthScore >= 80) {
    healthScoreBar.style.backgroundColor = "var(--success-color)"
    healthScoreBar.title = "Low Risk"
  } else if (currentHealthScore >= 60) {
    healthScoreBar.style.backgroundColor = "var(--warning-color)"
    healthScoreBar.title = "Moderate Risk"
  } else {
    healthScoreBar.style.backgroundColor = "var(--error-color)"
    healthScoreBar.title = "High Risk"
  }
}

function updateRecommendationsList() {
  const recommendationsList = document.getElementById("ai-recommendations-list")
  if (!recommendationsList) return

  recommendationsList.innerHTML = "" // Clear previous content

  if (!currentUser.recommendations || Object.keys(currentUser.recommendations).length === 0) {
    recommendationsList.innerHTML = `<p class="placeholder-text">Complete a health assessment to see your personalized recommendations.</p>`
    return
  }

  let hasRecommendations = false
  Object.keys(currentUser.recommendations).forEach((categoryKey) => {
    const categoryRecs = currentUser.recommendations[categoryKey]
    if (categoryRecs && categoryRecs.length > 0) {
      hasRecommendations = true
      const categoryTitle = categoryKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()) // Format category name

      const categoryDiv = document.createElement("div")
      categoryDiv.className = "recommendation-category"
      categoryDiv.innerHTML = `<h5>${categoryTitle}</h5><ul></ul>`
      const ul = categoryDiv.querySelector("ul")

      categoryRecs.forEach((rec, index) => {
        const uniqueId = `${categoryKey}-${index}`
        const isCompleted = currentUser.completedRecommendations.includes(uniqueId)

        const li = document.createElement("li")
        li.className = `recommendation-item priority-${rec.priority} ${isCompleted ? "completed" : ""}`
        li.innerHTML = `
          <strong>${rec.title}</strong>
          <p>${rec.description}</p>
          <span class="timeframe">${rec.timeframe}</span>
          <button class="btn btn-small btn-toggle-completion" data-category="${categoryKey}" data-index="${index}">
            ${isCompleted ? "✅ Done" : "Mark as Done"}
          </button>
        `
        ul.appendChild(li)
      })
      recommendationsList.appendChild(categoryDiv)
    }
  })

  if (!hasRecommendations) {
    recommendationsList.innerHTML = `<p class="placeholder-text">No specific recommendations generated for your profile at this time.</p>`
  }

  // Add event listeners to new buttons
  document.querySelectorAll(".btn-toggle-completion").forEach((button) => {
    button.addEventListener("click", (event) => {
      const category = event.target.dataset.category
      const index = Number.parseInt(event.target.dataset.index)
      const recommendation = currentUser.recommendations[category][index]
      markRecommendationAsDone(category, index)
    })
  })
}

function markRecommendationAsDone(category, index) {
  const uniqueId = `${category}-${index}`
  const recIndex = currentUser.completedRecommendations.indexOf(uniqueId)

  if (recIndex > -1) {
    // Already done, unmark it
    currentUser.completedRecommendations.splice(recIndex, 1)
  } else {
    // Not done, mark as done
    currentUser.completedRecommendations.push(uniqueId)
  }

  saveUserData()
  updateRecommendationsList() // Re-render the list to update UI
  showNotification(recIndex > -1 ? "Recommendation unmarked." : "Recommendation marked as done!", "success")
}

function showMealPlanDetails() {
  const mealPlanModalBody = document.getElementById("meal-plan-modal-body")
  mealPlanModalBody.innerHTML = "" // Clear previous content

  if (!currentUser.mealPlan || currentUser.mealPlan.length === 0) {
    mealPlanModalBody.innerHTML = `<p class="placeholder-text">No meal plan available. Please complete a health assessment.</p>`
  } else {
    currentUser.mealPlan.forEach((day, dayIndex) => {
      const dayDiv = document.createElement("div")
      dayDiv.className = "meal-plan-day"
      dayDiv.innerHTML = `<h4>Day ${dayIndex + 1}</h4>`

      Object.keys(day.meals).forEach((mealType) => {
        const mealsForType = day.meals[mealType]
        if (mealsForType && mealsForType.length > 0) {
          const mealTypeDiv = document.createElement("div")
          mealTypeDiv.className = "meal-type"
          mealTypeDiv.innerHTML = `<h5>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h5><ul></ul>`
          const ul = mealTypeDiv.querySelector("ul")

          mealsForType.forEach((meal) => {
            const li = document.createElement("li")
            li.innerHTML = `
              <strong>${meal.name}</strong>
              <p>Ingredients: ${meal.ingredients.join(", ")}</p>
              <span>Calories: ${meal.calories} | Prep: ${meal.prepTime} | Diff: ${meal.difficulty}</span>
              <span class="nutritional-focus">Focus: ${meal.nutritionalFocus}</span>
            `
            ul.appendChild(li)
          })
          dayDiv.appendChild(mealTypeDiv)
        }
      })
      mealPlanModalBody.appendChild(dayDiv)
    })
  }
  mealPlanModalOverlay.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeMealPlanModal() {
  if (mealPlanModalOverlay) {
    mealPlanModalOverlay.classList.remove("active")
    document.body.style.overflow = ""
  }
}

// Dashboard functionality
function updateDashboard() {
  // Update vitals display
  updateVitalsDisplay()
  updateMedicationList()
  updateHealthScore()
  // Ensure AI dashboard is updated if data is present
  displayAIDashboard()
}

function updateVitalsDisplay() {
  const vitals = currentUser

  // Update vital items
  const vitalItems = document.querySelectorAll(".vital-item")
  vitalItems.forEach((item) => {
    const label = item.querySelector(".vital-label").textContent
    const valueElement = item.querySelector(".vital-value")

    switch (label) {
      case "Heart Rate":
        valueElement.textContent = `${vitals.restingHeartRate} BPM`
        break
      case "Blood Pressure":
        valueElement.textContent = `${vitals.systolicBP} mmHg`
        break
      case "Temperature":
        valueElement.textContent = `N/A`
        break
      case "Weight":
        valueElement.textContent = `${vitals.weightKg} kg`
        break
    }
  })

  // Update hero vitals
  const heroMetrics = document.querySelectorAll(".health-metric")
  heroMetrics.forEach((metric) => {
    const valueElement = metric.querySelector(".metric-value")
    const unitElement = metric.querySelector(".metric-unit")
    const icon = metric.querySelector(".metric-icon")

    if (icon.classList.contains("heart-rate")) {
      valueElement.textContent = vitals.restingHeartRate
      unitElement.textContent = "BPM"
    } else if (icon.classList.contains("blood-pressure")) {
      valueElement.textContent = `${vitals.systolicBP}`
      unitElement.textContent = "mmHg"
    } else if (icon.classList.contains("temperature")) {
      valueElement.textContent = "N/A"
      unitElement.textContent = "°F"
    }
  })
}

function updateMedicationList() {
  const medicationList = document.getElementById("medication-list")
  if (!medicationList) return

  medicationList.innerHTML = ""

  currentUser.medications.forEach((medication) => {
    const medicationItem = document.createElement("div")
    medicationItem.className = "medication-item"

    medicationItem.innerHTML = `
            <div class="medication-info">
                <span class="medication-name">${medication.name}</span>
                <span class="medication-time">${medication.time}</span>
            </div>
            <button class="btn btn-small ${medication.taken ? "btn-success" : ""}" 
                    onclick="markTaken(this)" 
                    ${medication.taken ? "disabled" : ""}>
                ${medication.taken ? "Taken" : "Take"}
            </button>
        `

    medicationList.appendChild(medicationItem)
  })
}

function updateHealthScore() {
  const scoreNumber = document.querySelector(".score-number")
  const scoreCircle = document.querySelector(".score-svg circle:last-child")

  if (scoreNumber) {
    scoreNumber.textContent = currentUser.healthScore
  }

  if (scoreCircle) {
    const circumference = 2 * Math.PI * 45 // radius = 45
    const offset = circumference - (currentUser.healthScore / 100) * circumference
    scoreCircle.style.strokeDashoffset = offset
  }
}

// Modal functionality
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal && modalOverlay) {
    modalOverlay.classList.add("active")
    document.body.style.overflow = "hidden"
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove("active")
    document.body.style.overflow = ""

    // Reset forms
    const forms = modalOverlay.querySelectorAll("form")
    forms.forEach((form) => form.reset())
  }
}

// Close modal when clicking overlay
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal()
    }
  })
}
if (mealPlanModalOverlay) {
  mealPlanModalOverlay.addEventListener("click", (e) => {
    if (e.target === mealPlanModalOverlay) {
      closeMealPlanModal()
    }
  })
}

// Dashboard actions
function logVitals() {
  openModal("vitals-modal")
}

function saveVitals() {
  const form = document.getElementById("vitals-form")
  if (form) {
    // Use AI-enhanced form submission
    handleVitalsFormWithAI({ preventDefault: () => {}, target: form })
  }
}

function addMedication() {
  const name = prompt("Enter medication name:")
  const time = prompt("Enter time (e.g., 8:00 AM):")

  if (name && time) {
    currentUser.medications.push({
      name: name,
      time: time,
      taken: false,
    })
    updateMedicationList()
    showNotification("Medication added successfully!", "success")
    saveUserData() // Save after adding medication
  }
}

function markTaken(button) {
  const medicationItem = button.closest(".medication-item")
  const medicationName = medicationItem.querySelector(".medication-name").textContent

  // Find and update medication
  const medication = currentUser.medications.find((med) => med.name === medicationName)
  if (medication) {
    medication.taken = true
    button.textContent = "Taken"
    button.classList.add("btn-success")
    button.disabled = true

    showNotification(`${medicationName} marked as taken!`, "success")

    // Update health score
    currentUser.healthScore = Math.min(100, currentUser.healthScore + 2)
    updateHealthScore()
    saveUserData() // Save after marking medication
  }
}

function scheduleAppointment() {
  showNotification("Appointment scheduling feature coming soon!", "info")
}

function generateReport() {
  // If AI analysis is available, use the AI-generated report API
  if (currentUser.aiAnalysis) {
    generateDetailedReport()
  } else {
    // Fallback to basic report for non-AI users
    const reportData = {
      user: currentUser.fullName,
      date: new Date().toLocaleDateString(),
      vitals: {
        restingHeartRate: currentUser.restingHeartRate,
        systolicBP: currentUser.systolicBP,
        weightKg: currentUser.weightKg,
        heightCm: currentUser.heightCm,
        bmi: currentUser.bmi,
      },
      lifestyle: {
        physicalActivity: currentUser.physicalActivity,
        dietaryHabits: currentUser.dietaryHabits,
        smokingHabits: currentUser.smokingHabits,
        existingConditions: currentUser.existingConditions,
      },
      medications: currentUser.medications,
      healthScore: currentUser.healthScore,
      riskLevel: currentUser.riskLevel,
    }

    const basicReportContent = `
# HealthWise Basic Health Report

**Date:** ${reportData.date}
**Full Name:** ${reportData.user}

## 1. Key Health Metrics
- **BMI:** ${reportData.vitals.bmi}
- **Resting Heart Rate:** ${reportData.vitals.restingHeartRate} BPM
- **Systolic BP:** ${reportData.vitals.systolicBP} mmHg
- **Weight:** ${reportData.vitals.weightKg} kg
- **Height:** ${reportData.vitals.heightCm} cm

## 2. Overall Health Summary
- **Health Score:** ${reportData.healthScore}
- **Risk Level:** ${reportData.riskLevel.toUpperCase()}

## 3. Lifestyle Overview
- **Physical Activity:** ${reportData.lifestyle.physicalActivity}
- **Dietary Habits:** ${reportData.lifestyle.dietaryHabits}
- **Smoking Habits:** ${reportData.lifestyle.smokingHabits}
- **Existing Conditions:** ${reportData.lifestyle.existingConditions}

## 4. Medication Tracker
${reportData.medications.map((med) => `- ${med.name} at ${med.time} (Taken: ${med.taken ? "Yes" : "No"})`).join("\n")}

---
*This is a basic report. For detailed insights and personalized recommendations, please complete the AI-powered health assessment.*
    `
    downloadReport(basicReportContent, `HealthWise_Basic_Report_${new Date().toISOString().split("T")[0]}.md`)
    showNotification("Basic health report generated successfully!", "success")
  }
}

function generateDetailedReport() {
  // Placeholder for AI-generated report logic
  console.log("Generating detailed AI report...")
}

function downloadReport(content, filename) {
  const blob = new Blob([content], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">&times;</button>
        </div>
    `

  // Add notification styles if not already present
  if (!document.querySelector(".notification-styles")) {
    const styles = document.createElement("style")
    styles.className = "notification-styles"
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border-left: 4px solid var(--primary-color);
                z-index: 3000;
                min-width: 300px;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-success {
                border-left-color: var(--success-color);
            }
            
            .notification-error {
                border-left-color: var(--error-color);
            }
            
            .notification-warning {
                border-left-color: var(--warning-color);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
            }
            
            .notification-message {
                color: var(--text-primary);
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 4px;
                border-radius: 4px;
                transition: var(--transition-fast);
            }
            
            .notification-close:hover {
                background: var(--background-secondary);
                color: var(--text-primary);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `
    document.head.appendChild(styles)
  }

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    closeNotification(notification.querySelector(".notification-close"))
  }, 5000)
}

function closeNotification(button) {
  const notification = button.closest(".notification")
  if (notification) {
    notification.style.animation = "slideOutRight 0.3s ease-in"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }
}

// Animation on scroll
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".feature-card, .dashboard-card, .about-content, .contact-content, .ai-dashboard-grid > .dashboard-card",
  )
  animateElements.forEach((el) => observer.observe(el))
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // ESC to close modal
  if (e.key === "Escape") {
    closeModal()
    closeMealPlanModal() // Close meal plan modal too
  }

  // Ctrl/Cmd + K to open vitals modal
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault()
    logVitals()
  }
})

// Local storage for persistence
function saveToLocalStorage() {
  localStorage.setItem("healthwise_user", JSON.stringify(currentUser))
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("healthwise_user")
  if (saved) {
    const loadedUser = JSON.parse(saved)
    // Merge, ensuring new properties from currentUser default if not in loadedUser
    currentUser = {
      ...currentUser,
      ...loadedUser,
      completedRecommendations: loadedUser.completedRecommendations || [], // Ensure it's an array
    }
    updateDashboard() // Update both dashboards
  }
}

// Save data on user interaction (form submission, medication taken, recommendation marked)
function saveUserData() {
  saveToLocalStorage()
}

// Load data on page load
// Moved to DOMContentLoaded listener

// Save data before page unload
window.addEventListener("beforeunload", saveUserData)

// Utility functions
function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

function formatTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Performance optimization
const debouncedScroll = debounce(updateActiveNavLink, 10)
window.addEventListener("scroll", debouncedScroll)

// Error handling
window.addEventListener("error", (e) => {
  console.error("Application error:", e.error)
  showNotification("An error occurred. Please refresh the page.", "error")
})

// Service worker registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed")
      })
  })
}

// Calculate comprehensive health score based on all factors
function calculateComprehensiveHealthScore() {
  let score = 0
  let maxScore = 0

  // Age factor (20 points)
  maxScore += 20
  if (currentUser.age >= 18 && currentUser.age <= 65) score += 20
  else if (currentUser.age >= 13 && currentUser.age <= 80) score += 15
  else score += 10

  // BMI factor (20 points)
  maxScore += 20
  if (currentUser.bmi >= 18.5 && currentUser.bmi <= 24.9) score += 20
  else if (currentUser.bmi >= 17 && currentUser.bmi <= 29.9) score += 15
  else score += 10

  // Heart rate factor (15 points)
  maxScore += 15
  if (currentUser.restingHeartRate >= 60 && currentUser.restingHeartRate <= 100) score += 15
  else if (currentUser.restingHeartRate >= 50 && currentUser.restingHeartRate <= 110) score += 12
  else score += 8

  // Blood pressure factor (15 points)
  maxScore += 15
  if (currentUser.systolicBP < 120) score += 15
  else if (currentUser.systolicBP < 140) score += 12
  else score += 8

  // Physical activity factor (15 points)
  maxScore += 15
  switch (currentUser.physicalActivity) {
    case "very-active":
    case "extremely-active":
      score += 15
      break
    case "moderately-active":
      score += 13
      break
    case "lightly-active":
      score += 10
      break
    case "sedentary":
      score += 5
      break
  }

  // Smoking factor (10 points)
  maxScore += 10
  switch (currentUser.smokingHabits) {
    case "never":
      score += 10
      break
    case "former":
      score += 8
      break
    case "occasional":
      score += 5
      break
    case "regular":
      score += 3
      break
    case "heavy":
      score += 1
      break
  }

  // Existing conditions factor (5 points)
  maxScore += 5
  if (currentUser.existingConditions === "none") score += 5
  else if (currentUser.existingConditions === "diabetes" || currentUser.existingConditions === "hypertension")
    score += 3
  else score += 2

  // Calculate final percentage
  currentUser.healthScore = Math.round((score / maxScore) * 100)

  // Determine risk level
  if (currentUser.healthScore >= 80) currentUser.riskLevel = "low"
  else if (currentUser.healthScore >= 60) currentUser.riskLevel = "moderate"
  else currentUser.riskLevel = "high"
}

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    updateDashboard,
    showNotification,
    saveUserData,
    loadFromLocalStorage,
  }
}
