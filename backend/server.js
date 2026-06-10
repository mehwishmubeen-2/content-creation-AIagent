require("dotenv").config(); // Add this at the very top

const express = require("express");
const Groq = require("groq-sdk");
const { tavily } = require("@tavily/core");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Keys now come from .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

app.post("/generate", async (req, res) => {
  const { topic, contentType } = req.body;

  try {
    const searchResult = await tvly.search(topic, {
      searchDepth: "advanced",
      maxResults: 5,
    });

    const researchSummary = searchResult.results
      .map((r) => `- ${r.title}: ${r.content}`)
      .join("\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a Content Creation Agent. Write high-quality ${contentType} content.
          
Guidelines:
- blog: 600-900 words, SEO headings, engaging intro and CTA
- social: hooks, hashtags, platform-appropriate
- script: hook, body, CTA with timestamps
- caption: short, punchy, emojis and hashtags

Return ONLY the final content, ready to publish.`,
        },
        {
          role: "user",
          content: `Write a ${contentType} about: "${topic}"

Here is research to base it on:
${researchSummary}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const content = completion.choices[0].message.content;
    res.json({ content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);