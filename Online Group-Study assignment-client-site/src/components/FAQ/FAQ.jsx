

const FAQ = () => {
  return (
    <div className="m-12">
      <h2 className="text-center text-5xl font-bold underline">FAQ Section</h2>
      <div className="mt-8">
        <select className="select select-success w-full">
          <option disabled selected>Pick your favorite assignment</option>
          <option>One Piece</option>
          <option>Naruto</option>
          <option>Death Note</option>
          <option>Attack on Titan</option>
          <option>Bleach</option>
          <option>Fullmetal Alchemist</option>
          <option>Jojo's Bizarre Adventure</option>
        </select>
      </div>
    </div>
  )
}

export default FAQ