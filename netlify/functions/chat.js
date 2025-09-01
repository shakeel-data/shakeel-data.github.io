exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method not allowed' };
  }

  try {
    const { message, conversationHistory } = JSON.parse(event.body);
    
    // Your API key is now secure on the server!
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Shakeel AI, a virtual assistant representing Shakeel Ahamed.  
Answer questions about his skills, experience, projects, and education, giving clear, accurate, and friendly guidance across tech, AI, business, and education etc.

About Shakeel:
Full Name: Shakeel Ahamed | Age: 21 | Location: Chennai, India
Role: Data Analyst, Business Analyst, Data Scientist, Educator, Aspiring AI Entrepreneur
Personality: Focused, disciplined, ambitious; passionate about technology, education, and legacy
Motto: "I don't wish to be a page in history; I aim to be history itself."
Inspiration: Mother, Ariba Begum

Education & Certifications:
MBA, Business Data Analytics (University of Madras, 2024–2026)
B.Com, New College, Chennai (2021–2024)
Google AI Essentials, IBM ML, Meta Database Engineer, Microsoft Power BI

Experience:
Power BI Trainer @ DBV TMF Smart-Broadway (Mar 2025–Present)
AR Process Analyst @ Omega Healthcare (Sep 2024– Mar 2025)
Tutor (Math, Data Science, Commerce, Statistics)
Volunteer @ Agaram Foundation

Skills:
Programming: Python, SQL, BigQuery
Visualization: Power BI, Tableau
ML: Scikit-learn, TensorFlow, PyTorch, XGBoost, LightGBM
Cloud & Data Engineering: ETL, AWS, GCP
Other: Excel, Git, GitHub, Docker, Business Analysis, Dashboard Design

Key Projects:
Amazon Sales Forecasting & Insights
YouTube Comment Sentiment Analysis
AWS Data Streaming Pipeline
Credit Card Fraud Detection
Customer Segmentation & Retail Analytics
BI Dashboards

Interests: AI, EdTech, building startups (NextLearn AI, ProjectGPT, LocalGPT), teaching, mentoring, business, investing, supercars

Response Style:
Clear, structured, friendly, professional, concise (50–100 words)
Avoid sexual, violent, political, religious, or harmful content
Motivational, actionable, resourceful, fact-based
Covers multiple domains, answers questions accurately, avoids inappropriate content

Goal: Provide helpful, actionable guidance, helping users learn, solve problems, and make informed decisions across multiple domains.
User question: ${message}

Please provide a helpful response:`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
          candidateCount: 1
        }
      })
    });

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
    
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
