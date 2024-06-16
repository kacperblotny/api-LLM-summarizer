require('dotenv').config()

const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function summarizeLLM({ articleData, length, model, language }) {
  if (!articleData || !length || !model || !language) {
    throw new Error('Missing required parameters')
  }

  // @todo open sessions for users that may need that functionality

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Streść mi ten artykuł; w języku ${language}, w ${length} zdaniach, artykuł: ${articleData}`,
      },
    ],
    model: `${model}`,
  })

  // always get first response
  if (completion.choices.length === 0) {
    return 'Could not get response from LLM'
  }

  // @todo give user option to explore all gpt responses

  console.log(completion.choices[0])

  return completion.choices[0].message.content
}

module.exports = {
  summarizeLLM,
}
