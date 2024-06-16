const { extractUrlData } = require('../controllers/extractUrlData')
const puppeteer = require('puppeteer')

jest.mock('puppeteer')

describe('extractUrlData', () => {
  let mockPage
  let mockBrowser

  beforeEach(() => {
    mockPage = {
      evaluate: jest.fn(),
      goto: jest.fn(),
    }
    mockBrowser = {
      newPage: jest.fn(() => mockPage),
      close: jest.fn(),
    }

    puppeteer.launch.mockResolvedValue(mockBrowser)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should extract text content from a webpage', async () => {
    const mockUrl = 'https://example.com'
    const mockText = 'Example text content'

    mockPage.evaluate.mockResolvedValueOnce(mockText)

    const result = await extractUrlData(mockUrl)

    // assertions
    expect(result).toBe(mockText)
    expect(puppeteer.launch).toHaveBeenCalledTimes(1)
    expect(mockBrowser.newPage).toHaveBeenCalledTimes(1)
    expect(mockPage.goto).toHaveBeenCalledWith(mockUrl, {
      waitUntil: 'domcontentloaded',
    })
    expect(mockPage.evaluate).toHaveBeenCalled()
    expect(mockBrowser.close).toHaveBeenCalled()
  })

  it('should handle errors gracefully', async () => {
    const mockUrl = 'https://example.com'
    const errorMessage = 'Evaluation error'

    mockPage.evaluate.mockRejectedValueOnce(new Error(errorMessage))

    const result = await extractUrlData(mockUrl)

    // assertions
    expect(result).toBe('')
    expect(puppeteer.launch).toHaveBeenCalledTimes(1)
    expect(mockBrowser.newPage).toHaveBeenCalledTimes(1)
    expect(mockPage.goto).toHaveBeenCalledWith(mockUrl, {
      waitUntil: 'domcontentloaded',
    })
    expect(mockPage.evaluate).toHaveBeenCalled()
    expect(mockBrowser.close).toHaveBeenCalled()
  })
})
