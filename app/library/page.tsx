import Search from "@/components/search/Search"
import Sidebar from "@/components/sidebar/Sidebar"


const Library = () => {
  return (
    <div className="wrapper">
      <Search />
      <div className="sidebar__overlay sidebar__overlay--hidden"></div>
      <Sidebar />

      <div className="row">
        <div className="container">

          Library

        </div>
      </div>
    </div>
  )
}

export default Library
