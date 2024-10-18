import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { signOut } from "@/actions/auth";
import Modal from "@/components/get-started-modal/modal"
import Write from "@/components/svgs/write"
import "@/css/get-started-cont.css"
import Bookmark from "@/components/svgs/bookmark";



export default async function MainHeader() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("user", user);

  return (
    <header>
      <div className="Wrapper">
        <div className="LogoInput">
          <h1 className="medium-logo"> <Link href={"/"}> Medium</Link> </h1>
 
        </div>
        {user ? (
          <ul className="userHeader">
            <li>
              <input type="text" name="searchInput" placeholder="Search" className="searchInput" />
            </li>
            <li><Link href={'/bookmarks'}><Bookmark /></Link></li>
            <li><Link href={'/new-post'}> <Write /> Write</Link></li>
            <li>Hoşgeldin </li>
            <li>
              <form action={signOut}>
                <button>Çıkış yap</button>
              </form>
            </li>
          </ul>
        ) : (
          <ul className="notUserHeader">
            <Modal />
          </ul>
        )}
      </div>
    </header>
  )
}