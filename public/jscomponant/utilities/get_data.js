const getData = async (title) => {
  try {
    let res
    res = await fetch(`./${title}`)

    const result = await res.json()
    return result
  } catch (e) {
    console.log(e)
  }
}

export { 
  getData
 }