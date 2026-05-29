function Home() {
  return (
    <div className="relative top-30">
      {/* Hero Card */}

      <div className="grid-column bg-gradient-to-r from-red-700 to-red-500 rounded-3xl  p-6 shadow-lg">
        <div>
        <h1 className="text-white text-3xl font-black leading-tight">
          Donate Blood,
          <br />
          Save Lives ❤️
        </h1>

        <p className="text-red-100 mt-3 text-sm leading-relaxed">
          Find blood donors quickly inside your college community during
          emergencies.
        </p>

        <button className="mt-5 bg-white text-red-700 px-5 py-3 rounded-2xl font-bold">
          Find Donors
        </button>
        </div>
        <div className="bg-yellow-700 ">
          <img src="./img/logo.png" />
        </div>
      </div>
    </div>
  );
}

export default Home;
