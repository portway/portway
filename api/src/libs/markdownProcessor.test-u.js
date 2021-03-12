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

  describe('with an hr', () => {
    let tokens
    const TEST_MD = 'digit\n\n---\n\npig'

    beforeAll(() => {
      const mdTokens = md.parse(TEST_MD, {})
      tokens = processTokens(mdTokens)
    })

    it('should have an hr', () => {
      const hrToken = tokens[1]
      expect(hrToken.type).toBe('tag')
      expect(hrToken.tag).toBe('hr')
    })
  })

  describe('with a codeblock', () => {
    let tokens
    const TEST_MD = '```\nvar that = this;\n```'

    beforeAll(() => {
      const mdTokens = md.parse(TEST_MD, {})
      tokens = processTokens(mdTokens)
    })

    it('should have a code tag', () => {
      const codeToken = tokens[0]
      expect(codeToken.type).toBe('tag')
      expect(codeToken.tag).toBe('code')
      expect(codeToken.children.length).toEqual(1)
    })

    it('should have a text child', () => {
      const codeText = tokens[0].children[0]
      expect(codeText.type).toBe('text')
      expect(codeText.data).toBe('var that = this;\n')
    })
  })

  describe('with inline code', () => {
    let tokens
    const TEST_MD = '```\nvar that = this;\n```\n\nwhat about `inline code`?\n'

    beforeAll(() => {
      const mdTokens = md.parse(TEST_MD, {})
      tokens = processTokens(mdTokens)
    })

    it('should have an inline code', () => {
      const inlineTag = tokens[1].children[1]
      expect(inlineTag.type).toBe('tag')
      expect(inlineTag.tag).toBe('inline_code')
      expect(inlineTag.children.length).toBe(1)
      expect(inlineTag.children[0].data).toBe('inline code')
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

  // Test added to debug markdown processing, but not including as part of regular test suite
  // Test will run N iterations in the for loop, comparing the markdown processing value each time
  describe.skip('with an error prone markdown document', () => {
    let tokens, output
    const TEST_MD = "## Installing 11ty\n\nFirst, let's create a directory, initialize the project, and install 11ty.\n\n```bash\nmkdir 11ty-example\ncd 11ty-example\nnpm init -y\nnpm install --save-dev @11ty/eleventy node-fetch dotenv outdent\n```\n\nYou now have 11ty installed and should be able to run `npx eleventy` to make sure. If all is well, you should see the following:\n\n```bash\n➜  11ty-example npx eleventy\nWrote 0 files in 0.17 seconds (v0.11.1)\n```\n\n## A basic 11ty setup\n\nFirst, we're going to add some configuration and then add a basic layout for all of your pages to use.By default, 11ty likes to put everything in an directory named`_includes`, but we like to be more specific.\n\n1.Create a file`.eleventy.js`(note the preceeding dot) at the root of your project.Add this tiny configuration to this file and save it: \n\n```javascript\nrequire('dotenv').config()\nconst markdownIt = require(\"markdown-it\")\nconst outdent = require('outdent')\n\nmodule.exports = function (eleventyConfig) {\n  const md = new markdownIt()\n\n  eleventyConfig.addPairedShortcode(\"markdown\", (content) => {\n    return md.render(outdent`${ content } `)\n  })\n\n  return {\n    dir: {\n      includes: \"_includes\",\n      layouts: \"_layouts\"\n    }\n  }\n}\n```\n\n2.Next, create a directory`_layouts` and add the following file to it, named`default.njk`: \n\n```html\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>{{ title }}</title>\n  </head>\n  <body>\n    <div>\n      <header>\n        <h1><a href=\"/\">My blog with Portway</a></h1>\n      </header>\n      <main>\n        {{ content | safe }}\n      </main>\n    </div>\n  </body>\n</html>\n```\n\n3.Finally, let’s add your homepage by creating a file named`index.md` at the root of your project.In that file: \n\n```markdown\n---\nlayout: default.njk\ntitle: Home\n---\n\nI am some homepage content\n```\n\n4.Now that you have the most basic setup, run the 11ty server and see your homepage!\n\n```bash\nnpx eleventy --serve\n```"

    beforeAll(() => {
      const mdTokens = md.parse(TEST_MD, {})
      tokens = processTokens(mdTokens)
      output = JSON.stringify(tokens)
    })

    it('should produce the same value repeatedly', () => {
      for(let i=0;i<10000;i++) {
        const mdTokens = md.parse(TEST_MD, {})
        const newTokens = processTokens(mdTokens)
        expect(JSON.stringify(newTokens)).toEqual(output)
      }
    })
  })
})

