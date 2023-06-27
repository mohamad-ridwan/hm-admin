import MainNavbar from "./MainNavbar"
import { ButtonMenu } from "./action/ButtonMenu"
import { ProfileDesktop } from "./action/ProfileDesktop"
import { ProfileIconMobile } from "./action/ProfileIconMobile"

export async function Navbar() {
    return (
        <MainNavbar>
            <div>
                <ButtonMenu />
            </div>
            <div className="flex items-center">
                {/* profile (desktop) */}
                <ProfileDesktop/>
                
                {/* profile mobile */}
                <ProfileIconMobile/>
            </div>
        </MainNavbar>
    )
}