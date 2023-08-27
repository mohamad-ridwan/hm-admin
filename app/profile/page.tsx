import { Suspense } from "react";
import Loading from "app/loading";
import Template from "app/template";
import { Container } from "components/Container";
import { Profile } from "./Profile";

export default function ProfilePage(){
    return (
        <Suspense
            fallback={<Loading />}
        >
            <Template
                key="profile"
                title="Profile | Hospice Medical Admin"
                description="profile admin hospice medical"
                className="min-h-[100vh] w-[100vw]"
            >
                <Container
                title="Profile"
                overflow="overflow-x-auto"
                >
                    <Profile/>
                </Container>
            </Template>
        </Suspense>
    )
}