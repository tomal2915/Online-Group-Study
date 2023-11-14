import { ToastContainer } from "react-toastify"
import Banner from "../../components/Banner/Banner"
import Feature from "../../components/Feature/Feature"
import FAQ from "../../components/FAQ/FAQ"


const Home = () => {
  return (
    <div>
      <ToastContainer></ToastContainer>
      <Banner></Banner>
      <Feature></Feature>
      <FAQ></FAQ>
    </div>
  )
}

export default Home