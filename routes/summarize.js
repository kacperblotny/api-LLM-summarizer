const express = require('express')
const router = express.Router()

const { summarizeLLM } = require('../controllers/summarizeLLM')
const { extractUrlData } = require('../controllers/extractUrlData')

// @route   POST /summarize/:url/:length/:model/:language
// @desc    POST send article to summarize by LLM
// @access  public (limited)
router.post('/', async (req, res) => {
  try {
    const {
      url,
      length = '3',
      model = 'gpt-3.5-turbo',
      language = 'pl',
    } = req.query

    if (!url) {
      return res.status(400).json({ error: 'url parameter cannot be empty' })
    }

    // @todo check for correct BCP 47 codes for languages

    // available models
    const models = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o']

    // length of answer in range 1-10
    if (isNaN(Number(length)) || Number(length) < 1 || Number(length) > 10) {
      return res
        .status(400)
        .json({ error: 'Length has to be between 1 and 10' })
    }

    if (!models.includes(model)) {
      return res.status(400).json({
        error: `Unsupported model ${model}, supported models: ${models}`,
      })
    }

    // scrap and format article data
    const articleData = await extractUrlData(url)

    if (articleData.length === 0) {
      return res.status(400).json({ error: 'Could not get article data' })
    }

    // call LLM
    const articleSummary = await summarizeLLM({
      articleData,
      length,
      model,
      language,
    })

    res.json({ articleSummary })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
