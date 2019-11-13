import processTokens from './markdownProcessor'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

describe('markdownProcessor', () => {
  describe('with empty input', () => {
    let tokens
    const TEST_MD = ''

    beforeAll(() => {
      const mdTokens = md.parse(TEST_MD, {})
      tokens = processTokens(mdTokens)
    })

    it('should return an empty array', () => {
      expect(Array.isArray(tokens)).toBe(true)
      expect(tokens.length).toBe(0)
    })
  })

  describe('with invalid input', () => {
    it('should throw an error with an object', () => {
      expect(() => {
        processTokens({ anObject: true })
      }).toThrow()
    })

    it('should throw an error with undefined', () => {
      expect(() => {
        processTokens()
      }).toThrow()
    })
  })

  describe('with plain text', () => {
    let tokens
    const TEST_MD = 'this is just plain text'

    beforeAll(() => {
      const mdTokens = md.parse(TEST_MD, {})
      tokens = processTokens(mdTokens)
    })

    it('should have a single root token', () => {
      expect(tokens.length).toBe(1)
    })

    it('should be a paragraph token', () => {
      expect(tokens[0].tag).toBe('p')
    })

    it('should contain a child token', () => {
      expect(tokens[0].children.length).toBe(1)
    })

    it('should have a child with the text', () => {
      const child = tokens[0].children[0]
      expect(child.type).toBe('text')
      expect(child.data).toBe(TEST_MD)
    })
  })

  describe('with a list', () => {
    let tokens
    const TEST_MD = '- this is\n- a list\n- folks'

    beforeAll(() => {
      const mdTokens = md.parse(TEST_MD, {})
      tokens = processTokens(mdTokens)
    })

    it('should have a single root token', () => {
      expect(tokens.length).toBe(1)
    })

    it('should be a ul token', () => {
      expect(tokens[0].type).toBe('tag')
      expect(tokens[0].tag).toBe('ul')
    })

    it('should have 3 li children', () => {
      let count = 0
      tokens[0].children.forEach((child) => {
        count += 1
        expect(child.type).toBe('tag')
        expect(child.tag).toBe('li')
      })
      expect(count).toBe(3)
    })

    it('should have nested text nodes on each li', () => {
      tokens[0].children.forEach((child) => {
        expect(child.children.length).toBe(1)
        expect(child.children[0].type).toBe('text')
      })
    })
  })

  describe('with a link', () => {
    let tokens
    const TEST_MD = 'How about [a link](example.com)'

    beforeAll(() => {
      const mdTokens = md.parse(TEST_MD, {})
      tokens = processTokens(mdTokens)
    })

    it('should a root paragraph token', () => {
      expect(tokens.length).toBe(1)
      expect(tokens[0].type).toBe('tag')
      expect(tokens[0].tag).toBe('p')
    })

    it('should have two children', () => {
      expect(tokens[0].children.length).toBe(2)
    })

    it('should have child link', () => {
      const link = tokens[0].children[1]
      expect(link.type).toBe('tag')
      expect(link.tag).toBe('a')
      expect(link.attrs.href).toBe('example.com')
    })
  })

  describe('with a complex markdown document', () => {
    let tokens
    const TEST_MD = 'Blah _blah_ \n **blah**\n \n ## also what about\n * list item 1\n * lists **item 2**\n * lists _item 3_\n\t * sub item\n\t * sub item 2\n\n1. number\n2. list\n\t3. with a sub [link](example.com)\n4. 123'

    beforeAll(() => {
      const mdTokens = md.parse(TEST_MD, {})
      tokens = processTokens(mdTokens)
    })

    it('should have 4 root tokens', () => {
      expect(tokens.length).toBe(4)
    })

    describe('in the first paragraph', () => {
      let p; let children

      beforeAll(() => {
        p = tokens[0]
        children = p.children
      })

      it('should be a paragraph token', () => {
        expect(p.type).toBe('tag')
        expect(p.tag).toBe('p')
      })

      it('should have 4 children', () => {
        expect(children.length).toBe(4)
      })

      it('should contain blah text in the first child', () => {
        const textChild = children[0]
        expect(textChild.type).toBe('text')
        expect(textChild.data).toBe('Blah ')
      })

      it('should contain an em tag in the second child with blah text', () => {
        const emChild = children[1]
        expect(emChild.type).toBe('tag')
        expect(emChild.tag).toBe('em')
        expect(emChild.children.length).toBe(1)
        expect(emChild.children[0].type).toBe('text')
        expect(emChild.children[0].data).toBe('blah')
      })
    })

    describe('in the second h2', () => {
      let h2

      beforeAll(() => {
        h2 = tokens[1]
      })

      it('should be an h2 token', () => {
        expect(h2.type).toBe('tag')
        expect(h2.tag).toBe('h2')
      })

      it('should have 1 child', () => {
        expect(h2.children.length).toBe(1)
      })

      it('should have 1 child containing text', () => {
        const child = h2.children[0]
        expect(child.type).toBe('text')
        expect(child.data).toBe('also what about')
      })
    })

    describe('in the third ul', () => {
      let ul

      beforeAll(() => {
        ul = tokens[2]
      })

      it('should be a ul token', () => {
        expect(ul.type).toBe('tag')
        expect(ul.tag).toBe('ul')
      })

      it('should have 3 li children', () => {
        expect(ul.children.length).toBe(3)
        ul.children.forEach((child) => {
          expect(child.type).toBe('tag')
          expect(child.tag).toBe('li')
        })
      })

      describe('in the third child sublist', () => {
        let sublist
        beforeAll(() => {
          sublist = ul.children[2].children[2]
        })

        it('should be a sublist', () => {
          expect(sublist.type).toBe('tag')
          expect(sublist.tag).toBe('ul')
        })

        it('should have 2 li children', () => {
          expect(sublist.children.length).toBe(2)
          sublist.children.forEach((child) => {
            expect(child.type).toBe('tag')
            expect(child.tag).toBe('li')
          })
        })
      })
    })
  })
})

