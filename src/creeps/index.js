
function bodyCost (parts) {
  return parts.reduce((acc, p) => acc + BODYPART_COST[p])
}

function patternCost (setup) {
  return bodyCost(setup.body.pattern)
}

function generateBody (stats, availEnergy) {
  let patternCost = 0
  let patternLen = 0
  let numRepeats = 0
  const body = []

  // If prefix and suffix are to be kept proportional to body size
  // TODO: Drastic cleanup needed!
  if (stats.proportionalPrefixSuffix) {
    patternCost = bodyCost(stats.prefix) + bodyCost(stats.pattern) + bodyCost(stats.suffix)
    patternLen = stats.prefix.length + stats.pattern.length + stats.suffix.length
    numRepeats = Math.min(
      Math.floor(availEnergy / patternCost), // Max # of repeats a room can produce
      Math.floor(MAX_CREEP_SIZE / patternLen), // Max # of repetitions resulting in < 50 parts
      stats.sizeLimit
    )
  } else {
    // If prefix and suffix don't scale
    const extraCost = bodyCost(stats.prefix) + bodyCost(stats.suffix)
    patternCost = bodyCost(stats.pattern)
    patternLen = stats.pattern.length
    numRepeats = Math.min(
      Math.floor((availEnergy - extraCost) / patternCost),
      Math.floor((MAX_CREEP_SIZE - stats.prefix.length - stats.suffix.length) / patternLen),
      stats.sizeLimit
    )
  }

  // COMMENCE BUILDING
  // TODO: This portion can be re written to support a more streamlined approach
  // This is just the general idea of patterns and prefix/suffix construction
  if (stats.proportionalPrefixSuffix) { // Add the prefix
    numRepeats.forEach(() => body.push(stats.prefix))
  } else {
    body.push(stats.prefix)
  }

  if (stats.ordered) {
    for (const part of stats.pattern) {
      numRepeats.forEach(() => body.push(part))
    }
  } else {
    numRepeats.forEach(() => body.push(stats.pattern))
  }

  if (stats.proportionalPrefixSuffix) { // Add the suffix
    numRepeats.forEach(() => body.push(stats.suffix))
  } else {
    body.push(stats.suffix)
  }

  return body
}

function createCreep (setup) {
  const creep = {
    role: '',
    pattern: [],
    sizeLimit: Infinity,
    prefix: [],
    suffix: [],
    proportionalPrefixSuffix: false,
    ordered: true
  }
  _.defaults(setup, creep)

  return generateBody(setup)
}

export {
  bodyCost,
  createCreep,
  patternCost
}
