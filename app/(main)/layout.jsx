import MainHeader from "@/components/main/header"
import { createClient } from "@/utils/supabase/server";
import GetStartedContainer from "@/components/get-started-container/get-started-cont"
import PostsPage from "./posts/page";
import '@/css/userScreenCont.css'

export default async function MainLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("user", user);
  return (
    <div className="">
      {user ? (
       <div className="userScreenCont">
         <MainHeader />
         <hr />
       </div>
      ):(
        <div className="container">
          <MainHeader />
          <hr />
          <GetStartedContainer />
          <hr />
        </div>
      )}
      
      {children}
    </div>
  )
}