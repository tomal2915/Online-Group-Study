

const Banner = () => {
    return (
        <div className="hero min-h-screen bg-base-100">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img src="https://i.ibb.co/vsY8V5f/banner.jpg" className="rounded-lg" />
                <div className="">
                    <h1 className="text-5xl font-bold">Online <span className="text-7xl italic text-green-600">Group-Study</span></h1>
                    <p className="py-6">In this assignment, you will build a web application for online group study with friends(Every registered user is a friend of others ).Users can create assignments, complete them, and grade their friends' assignments.</p>
                </div>
            </div>
        </div>
    )
}

export default Banner