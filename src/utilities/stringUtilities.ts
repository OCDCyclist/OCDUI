export const splitCommaSeparatedString = (input: string | undefined) => {
    if (typeof input !== 'string') {
      return [];
    }

    return input
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
  }