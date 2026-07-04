export function drawCube(bag) {
  const total = bag.white + bag.black
  if (total <= 0) return 'empty'
  const r = Math.random() * total
  if (r < bag.white) {
    bag.white--
    return 'white'
  }
  bag.black--
  return 'black'
}
