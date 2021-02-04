export const hiddenFieldStyles = {
  height: 0,
  opacity: 0,
  minHeight: 'unset',
  padding: 0,
  position: 'absolute',
}

export const lightModeStyles = {
  base: {
    color: '#333333',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: '15px',
    '::placeholder': {
      color: '#CCCCCC'
    }
  },
  focus: {
    border: `thin solid #6074D6`
  },
  complete: {},
  invalid: {
    color: '#F55961',
    ':focus': {
      color: '#FBBCBF'
    },
    '::placeholder': {
      color: '#FBBCBF'
    }
  }
}

export const darkModeStyles = {
  base: {
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: '15px',
    '::placeholder': {
      color: '#666666'
    }
  },
  focus: {
    border: `thin solid #6074D6`
  },
  complete: {},
  invalid: {
    color: '#F55961',
    ':focus': {
      color: '#FBBCBF'
    },
    '::placeholder': {
      color: '#FBBCBF'
    }
  }
}
