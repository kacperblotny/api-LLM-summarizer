require('dotenv').config()
const nock = require('nock')
const { summarizeLLM } = require('../controllers/summarizeLLM')

describe('summarizeLLM', () => {
  const validArticleData = 'This is a test article.'
  const validLength = 2
  const validModel = 'gpt-4o'
  const validLanguage = 'en'

  afterEach(() => {
    nock.cleanAll()
  })

  it('should return a summary when valid parameters are provided', async () => {
    const mockResponse = {
      choices: [
        {
          message: { content: 'This is a summary.' },
        },
      ],
    }

    nock('https://api.openai.com')
      .post('/v1/chat/completions')
      .reply(200, mockResponse)

    const result = await summarizeLLM({
      articleData: validArticleData,
      length: validLength,
      model: validModel,
      language: validLanguage,
    })

    expect(result).toBe('This is a summary.')
  })

  it('should handle cases where the completion has no choices', async () => {
    const mockResponse = {
      choices: [],
    }

    nock('https://api.openai.com')
      .post('/v1/chat/completions')
      .reply(200, mockResponse)

    const result = await summarizeLLM({
      articleData: validArticleData,
      length: validLength,
      model: validModel,
      language: validLanguage,
    })

    expect(result).toBe('Could not get response from LLM')
  })

  it('should handle API errors gracefully', async () => {
    nock('https://api.openai.com').post('/v1/chat/completions').reply(500)

    await expect(
      summarizeLLM({
        articleData: validArticleData,
        length: validLength,
        model: validModel,
        language: validLanguage,
      })
    ).rejects.toThrow()
  })

  it('should throw an error when language is missing', async () => {
    await expect(
      summarizeLLM({
        articleData: validArticleData,
        length: validLength,
        model: validModel,
        // missing language
      })
    ).rejects.toThrow()
  })
  it('should throw an error when model is missing', async () => {
    await expect(
      summarizeLLM({
        articleData: validArticleData,
        length: validLength,
        // missing model
        language: validLanguage,
      })
    ).rejects.toThrow()
  })
  it('should throw an error when length is missing', async () => {
    await expect(
      summarizeLLM({
        articleData: validArticleData,
        // missing length
        model: validModel,
        language: validLanguage,
      })
    ).rejects.toThrow()
  })
  it('should throw an error when articleData is missing', async () => {
    await expect(
      summarizeLLM({
        // missing articleData
        length: validLength,
        model: validModel,
        language: validLanguage,
      })
    ).rejects.toThrow()
  })
})
